/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/encode','N/log', 'N/search','./Model/searchesInFamily.js','./Model/saldosInFamily.js','./Model/principalModel.js','N/file','./Model/helpersFamily.js','N/https','N/https/clientCertificate'],
    /**
 * @param{http} http
 * @param{https} https
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    ( encodde,log, search,modelSearch,modelSaldos,mainModel,file,helperMain,https,cert) => {
        
        
        
        let filesUrl = 'https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID='

        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            try {
                return mainModel.getRecords()
            } catch (e) {
                log.debug("Error de estados de cuenta: ", e)
            }
            
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try{
                // log.debug("******",mapContext)
                var datos = JSON.parse(mapContext.value);
                // log.debug("Datos: ",datos)
   
                // var peticion = datos;

                mapContext.write({
                    key: mapContext.key,
                    value: JSON.parse(mapContext.value)
                });
   
   
            } catch (e) {
                log.audit({
                    title: 'Error ',
                    details: e
                });
            }
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            // log.debug("-------",reduceContext)
            let valores = JSON.parse(reduceContext.values)
            
            log.debug("*--*--*",valores)
            if('id' in valores) {
                log.debug("Estados de cuenta con id: ", statementAccount(valores.saldosFavor,valores.min,valores.max,valores.alumnos,valores.id))
            }else{
                log.debug("Estados de cuenta: ", statementAccount(valores.saldosFavor,valores.min,valores.max,valores.alumnos))
            }

        }

        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        
        const statementAccount = (saldosAFavor,minimo,maximo,alumnosMain,idDoc = 0) => {
            try {
                // let dates = getDatesFormal()
                let listaDeArchivos = []
                let saldoAdeudadoCiclo = true
                let estadosEnviados = false
                let min = helperMain.setFormatDateOne(minimo) 
                let max = helperMain.setFormatDateTwo(maximo) 
                let cont = 0
                // log.debug("alumns",alumnosMain.length)
                alumnosMain.forEach(alumnos => {
                    /** Inicio de  de total de alumnos */
                    let response = {data:[]}
                    
                    let saldoAdeudado = modelSaldos.saldosAdeudados(alumnos,min,max)
                    log.debug("Cantidad",saldoAdeudado[1])
                    if (saldoAdeudado[1] > 0 )
                        saldoAdeudadoCiclo = false
                    log.debug("Saldos Malos",saldoAdeudado)
                    var invoiceSearchObj = search.create({
                        type: "invoice",
                        filters:
                        [
                           ["type","anyof","CustInvc"],
                           "AND",
                           ["amountremaining","equalto","0.00"],
                           "AND",
                           ["trandate","within",min,max], 
                           "AND",
                           [
                               ["custbody_mx_cfdi_uuid","isnot",""],
                               "OR",
                               ["custbody_efx_fe_uuid","isnot",""]
                           ],
                           "AND",
                           ["status","anyof","CustInvc:B"],
                           "AND",
                           ["custbody_efx_alumno","anyof",alumnos]
                        ],
                        columns:
                        [
                           search.createColumn({
                              name: "ordertype",
                              sort: search.Sort.ASC,
                              label: "Tipo de purchase order"
                           }),
                           search.createColumn({name: "internalid", label: "id"}),
                           search.createColumn({name: "trandate", label: "Fecha"}),
                           search.createColumn({name: "postingperiod", label: "Período"}),
                           search.createColumn({name: "taxperiod", label: "Período fiscal"}),
                           search.createColumn({name: "type", label: "Tipo"}),
                           search.createColumn({name: "tranid", label: "Número de documento"}),
                           search.createColumn({name: "entity", label: "Nombre"}),
                           search.createColumn({name: "custbody_efx_alumno", label: "Alumno"}),
                           search.createColumn({name: "account", label: "Cuenta"}),
                           search.createColumn({name: "memo", label: "Nota"}),
                           search.createColumn({name: "amount", label: "Importe"}),
                           search.createColumn({name: "custbody_mx_txn_sat_payment_term", label: "SAT Método de Pago"}),
                           search.createColumn({name: "custbody_mx_txn_sat_payment_method", label: "SAT Payment Method"}),
                           search.createColumn({name: "statusref", label: "Estado"}),
                           search.createColumn({name: "custbody_edoc_generated_pdf", label: "PDF generado"}),
                           search.createColumn({name: "custbody_psg_ei_certified_edoc", label: "XML Certificado"}),
                           search.createColumn({name: "custbody_efx_fe_pdf_file_ns", label: "PDF Antigua"}),
                           search.createColumn({name: "custbody_efx_fe_xml_file_ns", label: "XML Antigua"}),
                           search.createColumn({name: "location", label: "Campus"}),
                        //    search.createColumn({name: "item", label: "Articulos"}),
                           search.createColumn({name: "custbody_mx_cfdi_uuid", label: "UUID"}),
                           search.createColumn({name: "amountremaining", label: "Importe restante"}),
                           search.createColumn({name: "statusref", label: "Status"}),
                           search.createColumn({
                                name: "entitystatus",
                                join: "customer",
                                label: "Status"
                            }),
                        ]
                     });
                     
                    var searchResultCount = invoiceSearchObj.runPaged().count;
                    log.debug("Cantidad de facturas por año",searchResultCount);
                    let resultSet = invoiceSearchObj.run()
                    let fin = 1000
                    let currentRange = resultSet.getRange({
                                    start : 0,
                                    end : fin
                        });
                    let i = 0  
                    let j = 0  
                    // log.debug("Ancho de la busqueda: ", currentRange.length)
    
                        /** 
                         * Temporales
                         */
                        let internalidList = []
                        let documentId = {}
                        let listaEstadosPorAlumno = {}
                        // Fin
    
                    // while ( j < currentRange.length ) {
                    while ( j < currentRange.length ) {
                        let result = currentRange[j]
                        let idTutor = result.getValue({name:'entity'})
                        let idAlumno = result.getValue({name:'custbody_efx_alumno'})
                        let idFactura = result.getValue({name:'internalid'})
                        let entitystatus = result.getText({name:"entitystatus",join: "customer",label: "Status"})
                        internalidList.push(idFactura)
                        let saldoFavor = 0.0
                        if (idTutor in saldosAFavor){
                            saldosAFavor[idTutor]["hijos"].forEach(element => {
                                if (idAlumno == element["id"]){
                                    saldoFavor = element["monto"]
                                    return false
                                }
                                return true
                            })
                        } 

                        // let getPDF = ""
                        // let getXML = ""
                        // try{
                        //     getPDF = result.getValue({name:'custbody_edoc_generated_pdf'}) == "" ? ((result.getValue({name:'custbody_efx_fe_pdf_file_ns'})).split("id=")[1]).split("&")[0] :  result.getValue({name:'custbody_edoc_generated_pdf'})
                        //     getXML = result.getValue({name:'custbody_psg_ei_certified_edoc'}) == "" ? ((result.getValue({name:'custbody_efx_fe_xml_file_ns'})).split("id=")[1]).split("&")[0] :  result.getValue({name:'custbody_psg_ei_certified_edoc'})
                        // } catch (e) {
                        //     getPDF = "No contiene Archivo"
                        //     getXML = "No contiene Archivo"
                        // }
                        let documentoPDF = "Sín documento PDF"
                        let documentoCertificado = "Sín documento certificado"
                        if(result.getValue({name: "custbody_efx_fe_uuid"}) != "") {
                            if(result.getValue({name:"custbody_efx_fe_pdf_file_ns"}) != "")
                                documentoPDF = filesUrl + ((result.getValue({name:'custbody_efx_fe_pdf_file_ns'})).split("id=")[1]).split("&")[0]
                            if(result.getValue({name:"custbody_efx_fe_xml_file_ns"}) != "")
                                documentoCertificado = filesUrl + ((result.getValue({name:'custbody_efx_fe_xml_file_ns'})).split("id=")[1]).split("&")[0] + "&des=1"
                        }
                        if (result.getValue({name: "custbody_mx_cfdi_uuid"}) != "") {
                            if(result.getValue({name:"custbody_edoc_generated_pdf"}) != "")
                                documentoPDF = filesUrl + result.getValue({name:"custbody_edoc_generated_pdf"})
                            
                            if(result.getValue({name:"custbody_psg_ei_certified_edoc"}) != "")
                                documentoCertificado = filesUrl + result.getValue({name:"custbody_psg_ei_certified_edoc"}) + "&des=1"
                        }
                        if( idAlumno in listaEstadosPorAlumno ){
                            // if (Object.keys(documentId).length === 0) documentId[idAlumno] = {}
                            documentId[idAlumno][idFactura] = {
                                idtransaction : result.id,
                                notransaction : result.getValue({name:'tranid'}),
                                period : result.getText({name:'postingperiod'}),
                                date : result.getValue({name:'trandate'}),
                                totalamount : result.getValue({name:'amount'}),
                                urlpdf : documentoPDF,
                                urlxml : documentoCertificado,
                                items : [],
                                creditNotes : [],
                                payments : []
                              }
                        }else{
                            listaEstadosPorAlumno[idAlumno] = {
                                idstudent: idAlumno,
                                studentStatus : entitystatus,
                                studentName: result.getText({name:'custbody_efx_alumno'}),
                                idtutor: idTutor,
                                tutorName: result.getText({name:'entity'}),
                                campus: result.getText({name:'location'}),
                                cicloEscolar: helperMain.setStringDate(min,max),
                                outstanding: (idAlumno in saldoAdeudado[0] ? saldoAdeudado[0][idAlumno].totalamount : 0.0)  + " MN",
                                positiveBalance: saldoFavor + " MN",
                                transactions: [],
                            }
                            documentId[idAlumno] = {}
                            documentId[idAlumno][idFactura] = {
                                idtransaction : result.id,
                                notransaction : result.getValue({name:'tranid'}),
                                period : result.getText({name:'postingperiod'}),
                                date : result.getValue({name:'trandate'}),
                                totalamount : result.getValue({name:'amount'}),
                                urlpdf : documentoPDF,
                                urlxml : documentoCertificado,
                                items : [],
                                creditNotes : [],
                                payments : []
                              }
                            
                        }
                        
                        i++; j++;
                        if(i > searchResultCount){
                            log.debug("Se esta pasando")
                            break
                        }
                        if( j== fin ) {   
                            j=0  
                            // log.debug("Documentos : ",documentId)
                            // internalidList = []
                            // documentId = {}
                            currentRange = resultSet.getRange({
                                start : i,
                                end : i+fin
                            })
                            // log.debug("OPs: ",currentRange.length)
                        }
                        
                    }
                    // log.debug("Tamaño de lista IDfacturas: ",internalidList.length)
                    // log.debug("Tamaño de lista Transacciones: ",Object.keys(documentId).length)
                    // log.debug("Tamaño estados de cuenta",Object.keys(listaEstadosPorAlumno).length)
                    
    
                    // log.debug("Respuesta Articulos: ",modelSearch.getItems(internalidList))
                    let articulos = modelSearch.getItems(internalidList)
                    // log.debug("Tamano de articulos por factura",Object.keys(articulos).length)
                    
                    
                    // log.debug("Respuesta Notas credito: ",modelSearch.getNotasCredito(internalidList))
                    let notasCredito = modelSearch.getNotasCredito(internalidList)
                    // log.debug("Tamano de notas de credito  por factura",Object.keys(notasCredito).length)
                    
                    // log.debug("listaEstadosPorAlumno",listaEstadosPorAlumno)

                    let payments = modelSearch.getPagos(internalidList)
    
    
                    for (const key in documentId) {
                        if (Object.hasOwnProperty.call(documentId, key)) {
                            const element = documentId[key];
                            for (const keyFactura in element) {
                                if (Object.hasOwnProperty.call(element, keyFactura)) {
                                    const elementArticulo = element[keyFactura];
                                    if(keyFactura in articulos) {
                                        elementArticulo.items.push(articulos[keyFactura])
                                    }
                                    if(keyFactura in notasCredito) {
                                        elementArticulo.creditNotes.push(notasCredito[keyFactura])
                                    }
                                    if(keyFactura in payments) {
                                        elementArticulo.payments.push(payments[keyFactura])
                                    }
                                }
                            }
                        }
                    }
    
                    for (const key in documentId) {
                        if (Object.hasOwnProperty.call(documentId, key)) {
                            const element = documentId[key];
                            if(key in listaEstadosPorAlumno){
                                for (const keyFactura in element) {
                                    if (Object.hasOwnProperty.call(element, keyFactura)) {
                                        const elementFactura = element[keyFactura];
                                        listaEstadosPorAlumno[key].transactions.push(elementFactura)
                                    }
                                }
                            }
                        }
                    }
    
    
                    // log.debug("Lista de periodos",monthList)
                    
                    for (const key in listaEstadosPorAlumno) {
                        if (Object.hasOwnProperty.call(listaEstadosPorAlumno, key)) {
                            const element = listaEstadosPorAlumno[key];
                            response.data.push(element)
                        }
                    }
                    // log.debug("Log de muestra:",response)
                    // log.debug("Cantidad de estados de cuenta: ", response.data.length)
                    
                    if(true){
                        let fileObj = file.create({
                            name:  String(minimo) + "_" + String(maximo) + "_" + String(cont) + '.json',
                            fileType: file.Type.JSON,
                            contents: JSON.stringify(response)
                        });
                     
                        fileObj.folder = 34487;
                     
                        listaDeArchivos.push(fileObj.save())
    
                        cont += 1
                    }

                    log.debug("*******", JSON.stringify(response)  )

                    estadosEnviados = helperMain.sendStatement(response)


                    /** Fin de total de alumno */
                });
                if (idDoc != 0){
                    helperMain.updateHistorial({id:idDoc,enviado:estadosEnviados,estado:listaDeArchivos.join()})
                }else{
                    helperMain.historial(saldoAdeudadoCiclo,estadosEnviados,helperMain.setStringDate(minimo,maximo),listaDeArchivos.join())
                }
                   
            } catch (e) {
                log.debug("Error",e)
                // throw e.details || e.message || e.toString()
            }
            
        }
        const summarize = (summaryContext) => {

        }

        

        return {getInputData,map,reduce}
        // return {getInputData}

    });
