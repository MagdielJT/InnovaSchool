/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/runtime','N/search','./Model/innovaFamilyBusquedas.js','N/file','./Model/innovaFamilyGuardar.js','N/https'],
    /**
     * @param{runtime} runtime
     */
    (runtime,search,innovaBusquedas,file,innovaGuardar,https) => {
        
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
                
                // log.debug("Pagos de facturas: ", innovaBusquedas.pagosAplicados())
                // log.debug("Notas de crédito: ", innovaBusquedas.notasDeCredito())
                // log.debug("BorrrarTodos: ", innovaGuardar.borrar())
                // log.debug("Pagos de credito: ", innovaBusquedas.notasDeCredito(["15854","15959","20290","37625","37626","40623","41885","54917","58405","69528","72294","83173","85228","96582","115229","115313","117239","124757","132865","136821","140783","151399","160713","178049","181966","186873"]	))
                // return false
                let listaAlumnos = [1799
                    // 1741
                    // ,2335,
                    // 2345,
                    // ,2336
                ]
        //         let listaAlumnos =  ["12588","1799",
        // "12590",
        // "12592",
        // "12594",
        // "12596",
        // "12598",
        // "12602",
        // "12608",
        // "12610",
        // "12611",
        // "12613",
        // "12614",
        // "12616",
        // "12618",
        // "12620",
        // "12631",
        // "12633",
        // "12635",
        // "12640",
        // "12642",
        // "12644",
        // "12646",
        // "12648",
        // "12650",
        // "17540",
        // "12652",
        // "12655",
        // "12693",
        // "12657",
        // "12659",
        // "12660",
        // "12663",
        // "12665"]
                
                return search.create({
                    type: "invoice",
                    filters:
                    [
                        ["type","anyof","CustInvc"], 
                        "AND", 
                        // [[["custbody_mx_cfdi_uuid","isnotempty",""],"OR",["custbody_efx_fe_uuid","isnotempty",""]],"AND",["custbody_efx_alumno","anyof",listaAlumnos],"AND",["customer.status","noneof","16","15","17","7","6","14","12","8","11","10","9"],"AND",["taxline","is","F"],"AND",["status","anyof","CustInvc:B"]],
                        [[["custbody_mx_cfdi_uuid","isnotempty",""],"OR",["custbody_efx_fe_uuid","isnotempty",""]],"AND",["custbody_efx_alumno.status","anyof","13","16"],"AND",["taxline","is","F"] ,"AND",["custbody_efx_alumno","anyof",listaAlumnos],"AND",["status","anyof","CustInvc:B"]],
                        "AND", 
                        ["mainline","any",""]
                    ],
                    columns:
                    [
                       search.createColumn({name: "internalId", label: "Internal ID"}),
                       search.createColumn({name: "mainline", label: "*"}),
                       search.createColumn({name: "ordertype", label: "Order Type"}),
                       search.createColumn({name: "trandate", label: "Date"}),
                       search.createColumn({name: "asofdate", label: "As-Of Date"}),
                       search.createColumn({name: "postingperiod", label: "Period"}),
                       search.createColumn({name: "taxperiod", label: "Tax Period"}),
                       search.createColumn({name: "type", label: "Type"}),
                       search.createColumn({name: "tranid", label: "Document Number"}),
                       search.createColumn({name: "entity", label: "Name"}),
                       search.createColumn({
                          name: "custbody_efx_alumno",
                          sort: search.Sort.DESC,
                          label: "Alumno"
                       }),
                       search.createColumn({name: "memo", label: "Memo"}),
                       search.createColumn({name: "amount", label: "Amount"}),
                       search.createColumn({name: "custbody_efx_fe_formapago", label: "EFX FE - Forma de Pago"}),
                       search.createColumn({name: "custbody_efx_fe_metodopago", label: "EFX FE - Método de Pago"}),
                       search.createColumn({name: "custbody_mx_cfdi_uuid", label: "UUID"}),
                       search.createColumn({name: "custbody_efx_fe_uuid", label: "EFX FE - UUID"}),
                       search.createColumn({name: "custbody_efx_cuenta_abono", label: "Cuenta de abono"}),
                       search.createColumn({name: "custbody_efx_estado_aprobacion_fact", label: "Estado de Aprobación Fact"}),
                       search.createColumn({name: "amountremainingisabovezero", label: "Amount Remaining is above 0"}),
                       search.createColumn({name: "amountremaining", label: "Amount Remaining"}),
                       search.createColumn({name: "custbody_edoc_generated_pdf", label: "PDF generado"}),
                       search.createColumn({name: "custbody_psg_ei_certified_edoc", label: "XML Certificado"}),
                       search.createColumn({name: "custbody_efx_fe_pdf_file_ns", label: "PDF Antigua"}),
                       search.createColumn({name: "custbody_efx_fe_xml_file_ns", label: "XML Antigua"}),
                       search.createColumn({
                          name: "entitystatus",
                          join: "customer",
                          label: "Status"
                       }),
                       search.createColumn({name: "statusref", label: "Status"}),
                       search.createColumn({name: "applyingtransaction", label: "Applying Transaction"}),
                       search.createColumn({name: "account", label: "Account"}),
                       search.createColumn({name: "custbody_tkio_ligadepagotxtdetalle", label: "Liga de pago"}),
                       search.createColumn({name: "location", label: "Campus"}),
                       search.createColumn({name: "quantity", label: "Quantity"}),
                       search.createColumn({name: "item", label: "Item"}),
                       search.createColumn({
                            name: "custentity_efx_ip_eid",
                            join: "CUSTBODY_EFX_ALUMNO",
                            label: "ID Prospectus"
                        })

                    ]
                 })
            } catch (e) {
                log.debug("GetInputata: " + e.name,e.message)
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
         * @param {number} mapContext.exe cutionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try {
                let alumnollave = JSON.parse(mapContext.value).values.custbody_efx_alumno.value
                mapContext.write({
                    key: alumnollave,
                    value: JSON.parse(mapContext.value).values
                });   
            } catch (e) {
                log.debug("Map: " + e.name,e.message)
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
            try {
                let reduceData = reduceContext.values;
                let estructuraJson = {}
                
                let facturasPagadas = {}
                let articulos = {}
                let saldos = {}


                reduceData.forEach(element => {
                    let nuevoElemento = JSON.parse(element)
                    
                    if(Object.keys(estructuraJson).length === 0){
                        estructuraJson = {
                            idstudent: reduceContext.key,
                            idprospuectus: nuevoElemento["custentity_efx_ip_eid.CUSTBODY_EFX_ALUMNO"],
                            studentStatus: nuevoElemento["entitystatus.customer"].text,
                            studentName: nuevoElemento.custbody_efx_alumno.text,
                            idtutor:  nuevoElemento.entity.value,
                            tutorName: nuevoElemento.entity.text,
                            campus: nuevoElemento.location.text,
                            outstanding: 0.0,
                            pastDueBalance: 0.0,
                            positiveBalance: 0.0,
                            transactions: []
                        }
                    }
                    
                    let saldorestante = parseFloat(nuevoElemento.amountremaining) || 0.0

                    if(nuevoElemento.amountremainingisabovezero)
                        estructuraJson.outstanding += saldorestante
                    
                    if (nuevoElemento.mainline == "*"){
                        // let documentoPDF = "Sín documento PDF"
                        // let documentoCertificado = "Sín documento certificado"

                        // if( nuevoElemento.custbody_efx_fe_uuid != "") {
                        //     if(nuevoElemento.custbody_efx_fe_pdf_file_ns != "")
                        //         documentoPDF = urlGeneral + ((nuevoElemento.custbody_efx_fe_pdf_file_ns).split("id=")[1]).split("&")[0]
                            
                        //     if(nuevoElemento.custbody_efx_fe_xml_file_ns != "")
                        //         documentoCertificado = urlGeneral + ((nuevoElemento.custbody_efx_fe_xml_file_ns).split("id=")[1]).split("&")[0] + "&des=1"
                        // }
                        
                        // if (nuevoElemento.custbody_mx_cfdi_uuid != "") {
                        //     if(nuevoElemento.custbody_edoc_generated_pdf != "")
                        //         documentoPDF = urlGeneral + nuevoElemento.custbody_edoc_generated_pdf
                            
                        //     if(nuevoElemento.custbody_psg_ei_certified_edoc != "")
                        //         documentoCertificado = urlGeneral + nuevoElemento.custbody_psg_ei_certified_edoc + "&des=1"
                        // }
                        facturasPagadas[nuevoElemento.internalId.value] = {
                               status: "Pagada",
                               idtransaction: nuevoElemento.internalId.value,
                               notransaction: nuevoElemento.tranid,
                               period:  nuevoElemento.taxperiod.text,
                               date: nuevoElemento.trandate,
                               totalamount: nuevoElemento.amount,
                               totalrecharge: 0.0,
                               detailsrecharge: [],
                               documents: [
                                    // {
                                    //     urlpdf: documentoPDF,
                                    //     urlxml: documentoCertificado
                                    // }
                                ],
                                items: [],
                                creditNotes: [],
                                payments: []
                            }
                    }else{
                        if(!(nuevoElemento.internalId.value in articulos))
                            articulos[nuevoElemento.internalId.value] = []
                        
                        articulos[nuevoElemento.internalId.value].push(
                            {
                                item: nuevoElemento.item.text,
                                quantity: nuevoElemento.quantity,
                                amount: nuevoElemento.amount,
                                description: nuevoElemento.memo
                            }
                        )

                    }
                        
                });

                Object.keys(facturasPagadas).map(element => {
                    if (element in articulos)
                        facturasPagadas[element].items = articulos[element]
                        
                    estructuraJson.transactions.push(facturasPagadas[element])
                })
                // Object.keys(facturasPagadas).map(element => {
                // })
                estructuraJson.transactions["facturasId"] = Object.keys(facturasPagadas)
                
                reduceContext.write({
                    key: reduceContext.key,
                    value: estructuraJson
                });   
            } catch (e) {
                log.debug("Reduce: "+ e.name, e.message)
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
        const summarize = (summaryContext) => {
            try {
                let saldosAFavor = innovaBusquedas.saldosAFavor()
                let facturasAbiertas = innovaBusquedas.facturasAbiertas()
                let pagos = innovaBusquedas.pagosAplicados()
                let notasCredito = innovaBusquedas.notasDeCredito()
                // log.debug("notas: ", notasCredito)
                let estadosPorAlumno = {data:[]}
                summaryContext.output.iterator().each((key, valor) => { 
                    let value = JSON.parse(valor)

                    if( value.idtutor in saldosAFavor )
                        value.positiveBalance += parseFloat(saldosAFavor[value.idtutor][key].monto)                     

                    if( key in facturasAbiertas.saldos ){
                        let facturasV = facturasAbiertas.saldos[key].facturas
                        let pendiente = facturasAbiertas.saldos[key].saldoPendiente
                        let vencido = facturasAbiertas.saldos[key].saldoVencido

                        value.outstanding += pendiente
                        value.pastDueBalance = vencido

                        facturasV.map(element => {
                            value.transactions.push(facturasAbiertas.facturas[element])
                        })
                    }
                    value.transactions.map (factura => {
                        if(factura.idtransaction in pagos){
                            pagos[factura.idtransaction].map( cadaPago => {
                                factura["payments"].push({
                                    docNumber : cadaPago.docNumber,
                                    date : cadaPago.date,
                                    amount : cadaPago.amount,
                                    invoice : cadaPago.invoice
                                })
                                factura["documents"].push({
                                    urlpdf : cadaPago.pdfTimbrado,
                                    urlxml : cadaPago.xmlCertificado
                                })
                            })
                        }

                        if(factura.idtransaction in notasCredito){
                            log.debug("Existe 2:", [factura.idtransaction,factura.idtransaction in notasCredito])
                            factura["creditNotes"] = notasCredito[factura.idtransaction]
                        }
                    })
                    /** Antiguo método para traer pagos  */
                    // value.transactions.map( factura => {
                    //     if( key in pagos ){
                    //         let datosPagos = pagos[key]
                    //         Object.keys(datosPagos).map(element => {
                    //             datosPagos[element].map( (ico, n) => {
                    //                 let cadaId = datosPagos[element][n].invoice
                    //                 cadaId.map( i => {
                    //                     if( factura.idtransaction == i.id){
                    //                         factura["payments"].push({
                    //                             docNumber: datosPagos[element][n].docNumber,
                    //                             date: datosPagos[element][n].date,
                    //                             amount: i.amount,
                    //                             invoice: i.invoice
                    //                         })
                    //                     }
                    //                 })
                    //             })
                    //         })
                    //     }
                        
                    //     if(factura.idtransaction in notasCredito){
                    //         log.debug("Existe 2:", [factura.idtransaction,factura.idtransaction in notasCredito])
                    //         factura["creditNotes"] = notasCredito[factura.idtransaction]
                    //     }
                    //     // else{
                    //     //     factura["creditNotes"].return = []
                    //     // }
                    // })
                    /** Fin de pagos anterior */
                    estadosPorAlumno.data.push(value)
                    return true 
                });  

                /** Guardar en un archivo */

                let fileObj = file.create({
                    name: 'estadoseg.json',
                    fileType: file.Type.JSON,
                    contents: JSON.stringify(estadosPorAlumno)
                });
                fileObj.folder = 34487;
                fileObj.save()

                /** Fin de guardado */
                
                var datosParaEnviar = JSON.stringify(estadosPorAlumno)
                var headers= {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'User-Agent': 'Mozilla/5.0',
                    'Authorization': 'Bearer SW5ub3ZhOklubm92YQ==',
                    'Content-Type': 'application/json',
                    'Content-Length' : datosParaEnviar.length
                }

                requestResponse = https.post({
                    url: 'https://dmtest.innovaschools.edu.mx/api/json_data',
                    body: datosParaEnviar,
                    headers: headers
                });
                log.debug("Post: ",requestResponse)
                
            } catch (e) {
                log.debug("Summary: " + e.name,e.message)
            }
        }
        

        const archivosAEnviar = () => {
            // let fileObj = file.create({
            //     name:  key + '.json',
            //     fileType: file.Type.JSON,
            //     contents: JSON.stringify(value)
            // });
        
            // fileObj.folder = 34487;
        
            // fileObj.save()
            let documentoPDF = "Sín documento PDF"
            let documentoCertificado = "Sín documento certificado"
            if( nuevoElemento.custbody_efx_fe_uuid != "") {
                if(nuevoElemento.custbody_efx_fe_pdf_file_ns != "")
                    documentoPDF = urlGeneral + ((nuevoElemento.custbody_efx_fe_pdf_file_ns).split("id=")[1]).split("&")[0]
                
                if(nuevoElemento.custbody_efx_fe_xml_file_ns != "")
                    documentoCertificado = urlGeneral + ((nuevoElemento.custbody_efx_fe_xml_file_ns).split("id=")[1]).split("&")[0] + "&des=1"
            }
            if (nuevoElemento.custbody_mx_cfdi_uuid != "") {
                if(nuevoElemento.custbody_edoc_generated_pdf != "")
                    documentoPDF = urlGeneral + nuevoElemento.custbody_edoc_generated_pdf
                
                if(nuevoElemento.custbody_psg_ei_certified_edoc != "")
                    documentoCertificado = urlGeneral + nuevoElemento.custbody_psg_ei_certified_edoc + "&des=1"
            }
        }

        return {getInputData , map, reduce ,summarize }

    });