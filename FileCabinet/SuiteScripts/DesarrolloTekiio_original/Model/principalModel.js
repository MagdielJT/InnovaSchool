/**
 * @NApiVersion 2.1
 */
define(['N/search','./helpersFamily.js','./saldosInFamily.js'],
    /**
 * @param{search} search
 */
    (search,helperMain,modelSaldos) => {

        const getRecords = () => {
           try {
              let alumnos = getStudents()
              let saldosFavor = modelSaldos.saldosAFavor()
               var customrecord_tkio_estadocuenta_innfamilySearchObj = search.create({
                  type: "customrecord_tkio_estadocuenta_innfamily",
                  filters:
                  [],
                  columns:
                  [
                     search.createColumn({
                        name: "name",
                        sort: search.Sort.ASC,
                        label: "Name"
                     }),
                     search.createColumn({name: "id", label: "ID"}),
                     search.createColumn({name: "scriptid", label: "Script ID"}),
                     search.createColumn({name: "custrecord_tkio_cicloescolar_if", label: "Ciclo Escolar"}),
                     search.createColumn({name: "custrecord_tkio_estadocuenta_completo", label: "Completo"}),
                     search.createColumn({name: "created", label: "Date Created"}),
                     search.createColumn({name: "custrecord_tkio_estadocuenta_enviado", label: "Enviado"}),
                     search.createColumn({name: "custrecord_tkio_estadocuenta_innovaf", label: "Estado de Cuenta"}),
                     search.createColumn({name: "custrecord_tkio_generando_innfamily", label: "Generando"}),
                     search.createColumn({name: "custrecord_estimado_if", label: "Estimado"})
                  ]
               });
               //  Busqueda guardada que se enfoca a los registros que NO corresponden al ciclo escolar presente en busca de actualizaciones en los estados 
               //  de cuenta de los alumnos hasta que esten completos y enviados.
               var searchResultCount = customrecord_tkio_estadocuenta_innfamilySearchObj.runPaged().count;

               if (searchResultCount == 0) {

                  let starting = helperMain.setFormatDateOne(2019)
                  let ending = helperMain.setFormatDateTwo()
                  let total = parseInt(ending.split("/")[2]) - parseInt(starting.split("/")[2])
                  let arregloCiclos = {}

                  for (let index = 0; index < total; index++) {
                     arregloCiclos["ciclo_"+index] = {
                        min : parseInt(starting.split("/")[2]) + index,
                        max : parseInt(starting.split("/")[2]) + index + 1,
                        alumnos : alumnos,
                        saldosFavor : saldosFavor
                     }
                  }

                  return arregloCiclos
               }

               let cicloActual = helperMain.setStringDate()
               let estadosIncompletos = {}
               let estadosParaEnviar = []
               let resultadoCiclo = {}
               // log.debug("Resultado de registros guardados",searchResultCount);

               customrecord_tkio_estadocuenta_innfamilySearchObj.run().each(function(result){

                  let completo = result.getValue("custrecord_tkio_estadocuenta_completo")
                  let enviado = result.getValue("custrecord_tkio_estadocuenta_enviado")
                  let tituloCiclo = result.getValue("custrecord_tkio_cicloescolar_if")

                  if (completo && enviado && cicloActual !== tituloCiclo)
                     return true

                  if (completo && !enviado){
                     estadosParaEnviar.push([result.getValue("custrecord_tkio_estadocuenta_innovaf"),result.id])
                     return true
                  }

                  resultadoCiclo[tituloCiclo] = {
                     ciclo :tituloCiclo,
                     id : result.id,
                     numero :  result.getValue("custrecord_estimado_if")
                  }
                  return true;
               });

               if(estadosParaEnviar.length > 0){
                  
                  estadosParaEnviar.forEach(element => {
                     let cadaArchivo = element[0].split(",")
                     let respuesta;

                     cadaArchivo.forEach(elementA => {
                        respuesta = helperMain.sendStatement({file:elementA})
                     });

                     let respuestaActualizar = helperMain.updateHistorial({id:element[1],enviado:respuesta})
                     // log.debug("respuestaActualizar",respuestaActualizar)
                  });

               }

               if(!(cicloActual in resultadoCiclo)){
                  
                  // log.debug("No esta el ciclo guardar uno y mandar ID")
                  resultadoCiclo[cicloActual] = {
                     ciclo :cicloActual,
                     id : helperMain.historial(false,false,helperMain.setStringDate(),""),
                     numero :  4
                  }

               }
               let cont = 0
               for (const key in resultadoCiclo) {
                  if (Object.hasOwnProperty.call(resultadoCiclo, key)) {
                     const element = resultadoCiclo[key];
                     estadosIncompletos["ciclo_"+cont] = {
                        min : (element.ciclo.split(" - ")[0]).split(" ")[1],
                        max : (element.ciclo.split(" - ")[1]).split(" ")[1],
                        alumnos : alumnos,
                        saldosFavor : saldosFavor,
                        id : element.id,
                        numero : 4
                     }
                  }
                  cont += 1
               }
               // log.debug("------",resultadoCiclo)
               // log.debug(" ***-*-*-*-  --- ",estadosIncompletos)
               return estadosIncompletos


            } catch (e) {
               log.debug({
                  title: "Error busqueda principal",
                  details: e
               })
            }
        }
        // Estas consultas se encargaran de buscar estados de cuenta del presente ciclo escolar
        // Busca a todos a los alumnos
        // los divide en en bultos de 100 y rrealiza las busquedas 
        const getStudents = () => {
           try {
               var customerSearchObj = search.create({
                  type: "customer",
                  filters:
                  [
                     ["stage","anyof","CUSTOMER"], 
                     "AND", 
                     ["category","anyof","2"], 
                     "AND", 
                     ["status","anyof",["13","16"]]
                  ],
                  columns:
                  [
                     search.createColumn({
                        name: "entityid",
                        sort: search.Sort.ASC,
                        label: "ID"
                     }),
                     search.createColumn({name: "altname", label: "Nombre"}),
                     search.createColumn({name: "internalid", label: "Id interno"}),
                     search.createColumn({name: "email", label: "Correo electrónico"}),
                     search.createColumn({name: "phone", label: "Teléfono"}),
                     search.createColumn({name: "altphone", label: "Número telefónico de la oficina"}),
                     search.createColumn({name: "fax", label: "Fax"}),
                     search.createColumn({name: "contact", label: "Contacto principal"}),
                     search.createColumn({name: "altemail", label: "Correo electrónico alternativo"}),
                     search.createColumn({name: "custentity_efx_fe_cliente_mostrador", label: "EFX FE - Cliente Mostrador"}),
                     search.createColumn({name: "custentity_4599_sg_uen", label: "UEN"}),
                     search.createColumn({name: "custentity_my_brn", label: "BRN"}),
                     search.createColumn({name: "custentity_efx_ip_eid", label: "ID Prospectus"}),
                     search.createColumn({name: "custentity_efx_bancoreceptor", label: "Banco Receptor"}),
                     search.createColumn({name: "custentity_efx_estado_cuenta", label: "Estado de Cuenta"}),
                     search.createColumn({name: "custentity_efx_cuentainterbancaria", label: "Cuenta Bancaria"}),
                     search.createColumn({name: "custentity_efx_ip_rvoealumno", label: "IP RVOE"})
                  ]
               });
               var searchResultCount = customerSearchObj.runPaged().count;
               log.debug("Resultado estudiantes",searchResultCount);
               let listaAlumnos = []
               customerSearchObj.run().each(function(result){
                  listaAlumnos.push(result.getValue({name:"internalid"}))
                  return true;
               });
               let perChunk = 750
               let chunkPorAlumnos =  listaAlumnos.reduce((resultArray, item, index) => { 
                  const chunkIndex = Math.floor(index/perChunk)
                     
                  if(!resultArray[chunkIndex]) {
                     resultArray[chunkIndex] = [] 
                  }
                     
                  resultArray[chunkIndex].push(item)
                     
                  return resultArray
               }, [])
               log.debug("Chunk Alumnos: ", chunkPorAlumnos.length)
               return chunkPorAlumnos
            } catch (e) {
               log.debug({
                  title: "Error busqueda alumnos",
                  details: e
               })
            }
         }
        // [1746,1738,10444]
        return { getRecords}

    });
