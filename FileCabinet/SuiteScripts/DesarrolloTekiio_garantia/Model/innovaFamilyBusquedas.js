/**
 * @NApiVersion 2.1
 */
define(['N/search','N/file'],
    /**
 * @param{search} search
 */
(search,file) => {
        let urlGeneral = 'https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID='
        let alumnosClave = [1799/*1741,2335,2345,2336*/]
        // let alumnosClave =  ["12588","1799",
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
        /**
         * It searches for a custom record type called "EFX - Recargos TKIO Search (copy)" and returns
         * the results.
         * Busqueda guardada para mostrar fecha límite de pago por mes.
         */
        const fechaLimiteDePago = () => {
            try {
                /* Getting the current month and adding 1 to it. */
                let mesActual = new Date().getMonth() + 1
                /* Creating a search object. */
                let fechaLimitePago = search.create({
                    type: "customrecord_efx_recargos",
                    filters:
                    [
                    ["custrecord_efx_recargos_mes","anyof",mesActual]
                    ],
                    columns:
                    [
                    search.createColumn({
                        name: "scriptid",
                        sort: search.Sort.ASC,
                        label: "Script ID"
                    }),
                    search.createColumn({name: "custrecord_efx_reg_porcentaje", label: "Porcentaje"}),
                    search.createColumn({name: "custrecord_efx_reg_dias", label: "Último día sin recargos"}),
                    search.createColumn({name: "custrecord_efx_recargos_mes", label: "Mes"}),
                    search.createColumn({name: "custrecord_efx_cb_condonacion", label: "Condonación"})
                    ]
                });
                
                /* Running the search. */
                let contenidoBusqueda = fechaLimitePago.run()
                
                /* Getting the first 10 results of the search. */
                let datosBusqueda = contenidoBusqueda.getRange(0,10)

                let resultadoBusqueda = {}
                if(datosBusqueda.length){
                    /* Getting the values of the columns that were created in the search. */
                    resultadoBusqueda.ultimoDia = datosBusqueda[0].getValue({name:"custrecord_efx_reg_dias"})
                    resultadoBusqueda.mes = datosBusqueda[0].getValue({name:"custrecord_efx_recargos_mes"})
                    resultadoBusqueda.porcentaje = datosBusqueda[0].getValue({name:"custrecord_efx_reg_porcentaje"})
                }

                /* Returning the result of the search. */
                return resultadoBusqueda
                /*
                customrecord_efx_recargosSearchObj.id="customsearch1657553146694";
                customrecord_efx_recargosSearchObj.title="EFX - Recargos TKIO Search (copy)";
                var newSearchId = customrecord_efx_recargosSearchObj.save();
                */
            } catch (e) {
                /* Logging the error message. */
                log.debug({
                    title: e.name,
                    details: e.message
                })
            }
        }
        
        /**
         * It returns an object with the parents' IDs as keys and the children's IDs and the amount of
         * money as values
         * @returns An object with the following structure:
         * ```
         * {
         *     "padreId": {
         *         "nombre": "padreName",
         *         "alumnoid": {
         *             "nombre": "alumnoName",
         *             "monto": "monto"
         *         }
         *     }
         * }
         * ```
         */
        const saldosAFavor = () => {
            try {
                let padreSaldoFavor = {}
                /* Creating a search object. */
                let listadeClientes = search.create({
                    type: 'customrecord_tkio_saldo_afavor_padre',
                    filters: [
                        ["custrecord_tkio_saldo_padre_monto", search.Operator.ISNOT,""],
                        "AND",
                        ["custrecord_tkio_saldo_padre_monto",search.Operator.ISNOT,"0"],
                        "AND",
                        ["custrecord_tkio_saldo_padre_monto",search.Operator.ISNOT,"0.0"],
                        "AND",
                        [
                            ["custrecord_tkio_saldo_afavor_clitneteid",search.Operator.NONEOF,-1],
                            "AND",
                            ["custrecord_tkio_saldo_hijoid",search.Operator.NONEOF,-1]
                        ],
                    ],
                    columns:[
                        search.createColumn({
                            name: "custrecord_tkio_saldo_padre_monto",
                        }),
                        search.createColumn({
                            name: "custrecord_tkio_saldo_hijoid",
                        }),
                        search.createColumn({
                            name: "custrecord_tkio_saldo_afavor_clitneteid",
                        })
                    ]
                })
                /* Counting the number of results that the search will return. */
                let cuentaTotal = listadeClientes.runPaged().count
                log.debug({
                    title: "Cantidad de casos con saldo a favor",
                    details: cuentaTotal
                })
                if ( cuentaTotal !== 0) {
                    /* Iterating over the results of the search. */
                    listadeClientes.run().each(function(result){
                        let padreId = result.getValue({name:'custrecord_tkio_saldo_afavor_clitneteid'})
                        let alumnoid = result.getValue({name:'custrecord_tkio_saldo_hijoid'})

                        /* Checking if the value of the variables `padreId` and `alumnoid` are empty
                        strings. If they are, it returns false. */
                        if(padreId == "" || alumnoid == "")  return false

                        let padreNombre = result.getText({name:'custrecord_tkio_saldo_afavor_clitneteid'})
                        let alumnoNombre = result.getText({name:'custrecord_tkio_saldo_hijoid'})
                        let monto = parseFloat( result.getValue({name:'custrecord_tkio_saldo_padre_monto'}) )

                        /* Checking if the value of the variable `monto` is less than or equal to 0.0
                        or if it is not a number. If it is, it returns false. */
                        if ( monto <= 0.0 || isNaN(monto) ) return false
                                
                        if (!(padreId in padreSaldoFavor)) {
                            padreSaldoFavor[padreId] = {nombre:padreNombre}
                            padreSaldoFavor[padreId][alumnoid] = { nombre:alumnoNombre,monto }
                            
                        }else{
                            padreSaldoFavor[padreId][alumnoid] =  { nombre:alumnoNombre,monto } 
                        }
                        
                        return true
                    })
                }
                return padreSaldoFavor

            } catch (e) {
                log.debug("Saldos a favor: " + e.name,e.message)
            }
        }

        const notasDeCredito = (element) => {
            try {
                let notasCreditoDesde = {}
                let reembolsos = {}
                var creditmemoSearchObj = search.create({
                    type: "creditmemo",
                    filters:
                    [
                        ["type","anyof","CustCred"], 
                        "AND", 
                        ["custbody_efx_alumno.status","anyof","13","16"], 
                        "AND", 
                        ["mainline","any",""], 
                        "AND", 
                        ["taxline","any",""], 
                        "AND", 
                        ["status","noneof","CustCred:V"], 
                        "AND", 
                        ["custbody_efx_alumno","anyof",alumnosClave], 
                        "AND", 
                        ["appliedtotransaction.mainline","is","T"], 
                        "AND", 
                        ["appliedtolinkamount","greaterthan","0.00"]
                    ],
                    columns:
                    [
                        search.createColumn({name: "appliedtolinkamount", label: "Applied To Link Amount"}),
                        search.createColumn({name: "ordertype", label: "Order Type"}),
                        search.createColumn({name: "mainline", label: "*"}),
                        search.createColumn({name: "trandate", label: "Date"}),
                        search.createColumn({name: "type", label: "Type"}),
                        search.createColumn({name: "tranid", label: "Document Number"}),
                        search.createColumn({name: "account", label: "Account"}),
                        search.createColumn({
                           name: "custbody_efx_alumno",
                           sort: search.Sort.DESC,
                           label: "Alumno"
                        }),
                        search.createColumn({name: "appliedtotransaction", label: "Applied To Transaction"}),
                        search.createColumn({name: "createdfrom", label: "Created From"}),
                        search.createColumn({name: "reimbursableamount", label: "Reimbursable Amount"})
                     ]
                 });
                    var searchResultCount = creditmemoSearchObj.runPaged().count;
                    log.debug("Resultado nota",searchResultCount);
                    let resultSet = creditmemoSearchObj.run()
                    let fin = 1000
                    let currentRange = resultSet.getRange({
                        start : 0,
                        end : fin
                    });
                    let i = 0  
                    let j = 0
                    /** ------------------------------------ */


                    while ( j < currentRange.length ) {
                        
                        let result = currentRange[j]
                        
                        let createdfrom = result.getText({name:"createdfrom"})
                        let createdfromID = result.getValue({name:"createdfrom"})

                        let factApliada = result.getText({name:"appliedtotransaction"})
                        let factApliadaID = result.getValue({name:"appliedtotransaction"})

                        let montoAplicado = result.getValue({name:"appliedtolinkamount"})
                        let montoTotal = result.getValue({name:"reimbursableamount"})
                        
                        let docNumber = result.getValue({name:"tranid"})
                        
                        let trandate = result.getValue({name:"trandate"})
                        
                        log.debug("Datos: ", [["Creado desde: ",createdfrom],["Nota de credito",docNumber],["aplicadaA",factApliada],["Monto",montoAplicado],["Fecha",trandate]])
                        
                        if(!(createdfromID in notasCreditoDesde)){
                            notasCreditoDesde[createdfromID] = []
                            notasCreditoDesde[createdfromID].push({
                                docNumber: docNumber,
                                date: trandate,
                                invoice: createdfrom,
                                amount: montoTotal
                            })
                            
                            if(!(createdfromID in reembolsos))
                                reembolsos[createdfromID] = []
                                
                            reembolsos[createdfromID].push({
                                docNumber: factApliada,
                                date: trandate,
                                amount : montoAplicado
                            })
                        }else{

                            if(!(createdfromID in reembolsos))
                                reembolsos[createdfromID] = []
                                
                            reembolsos[createdfromID].push({
                                docNumber: factApliada,
                                date: trandate,
                                amount : montoAplicado
                            })
                        }

                        i++; j++;
                        if(i > searchResultCount){
                            log.debug("Se esta pasando")
                            break
                        }
                        if( j== fin ) {   
                            j=0
                            currentRange = resultSet.getRange({
                               start : i,
                               end : i+fin
                            })
                        }
                    }
                    
                    Object.keys(reembolsos).map(element => {
                        if(element in notasCreditoDesde){
                            notasCreditoDesde[element][0].return = reembolsos[element]
                        } 
                    })

                    return notasCreditoDesde
            } catch (e) {
                log.debug("Notas de credito: " + e.name, e.message)
            }
        }

        /**
         * It takes an array of internal ids of invoices and returns an object with the internal id of
         * the invoice as the key and the value is an object with the document number, date, invoice
         * number and an array of objects with the amount of the payment
         * @param element - An array of internal IDs of the transactions to be searched.
         */
        const pagosAplicados = (element) => {
            try {
                var customerpaymentSearchObj = search.create({
                        type: "customerpayment",
                        filters:
                        [
                            ["type","anyof","CustPymt"], 
                            "AND", 
                            ["mainline","any",""], 
                            "AND", 
                            ["accountmain","anyof","125","720"], 
                            "AND", 
                            ["appliedtotransaction.mainline","is","T"],
                            "AND", 
                            ["custbody_efx_alumno.status","anyof","13","16"],
                            "AND", 
                            ["custbody_efx_alumno","anyof",alumnosClave]
                        ],
                        columns:
                        [
                            search.createColumn({name: "trandate", label: "Date"}),
                            search.createColumn({name: "type", label: "Type"}),
                            search.createColumn({name: "tranid", label: "Document Number"}),
                            search.createColumn({
                               name: "custbody_efx_alumno",
                               sort: search.Sort.DESC,
                               label: "Alumno"
                            }),
                            search.createColumn({name: "account", label: "Account"}),
                            search.createColumn({name: "appliedtotransaction", label: "Applied To Transaction"}),
                            search.createColumn({name: "amountremaining", label: "Amount Remaining"}),
                            search.createColumn({name: "appliedtolinkamount", label: "Applied To Link Amount"}),
                            search.createColumn({
                               name: "custbody_mx_cfdi_uuid",
                               join: "appliedToTransaction",
                               label: "UUID"
                            }),
                            search.createColumn({
                                name: "custbody_edoc_generated_pdf",
                                join: "appliedToTransaction",
                                label: "Generated PDF"
                            }),
                            search.createColumn({
                                name: "custbody_psg_ei_certified_edoc",
                                join: "appliedToTransaction",
                                label: "Certified E-Document"
                            }),
                            search.createColumn({
                                name: "custbody_efx_fe_uuid",
                                join: "appliedToTransaction",
                                label: "UUID Anterior"
                            }),
                            search.createColumn({
                                name: "custbody_efx_fe_xml_file_ns",
                                join: "appliedToTransaction",
                                label: "PDF Anterior"
                            }),
                            search.createColumn({
                                name: "custbody_efx_fe_pdf_file_ns",
                                join: "appliedToTransaction",
                                label: "XML  Anterior"
                            })
                        ]
                });
                var searchResultCount = customerpaymentSearchObj.runPaged().count;
                log.debug("customerpaymentSearchObj result count",searchResultCount);
                let resultSet = customerpaymentSearchObj.run()
                let fin = 1000
                let currentRange = resultSet.getRange({
                    start : 0,
                    end : fin
                });
                let i = 0  
                let j = 0
                let pagosPorAlumnos = {}
                let pagosPorFactura = {}
                let listaPagosAplicados = {}
                while ( j < currentRange.length ) {
                    let result = currentRange[j]
                    let internalId = currentRange[j].id
                    let tranid = result.getValue({name:"tranid"})
                    let trandate = result.getValue({name:"trandate"})
                    let amountremaining = result.getValue({name:"amountremaining"})
                    let appliedtolinkamount = result.getValue({name:"appliedtolinkamount"})
                    let uuid = result.getValue({name:"custbody_mx_cfdi_uuid",join: "appliedToTransaction", label:"UUID"})
                    let pdfTimbrado = result.getValue({name:"custbody_edoc_generated_pdf",join: "appliedToTransaction", label:"Generated PDF"})
                    let xmlCertificado = result.getValue({name:"custbody_psg_ei_certified_edoc",join: "appliedToTransaction", label:"Certified E-Document"})
                    let uuidAnterior = result.getValue({name:"custbody_efx_fe_uuid",join: "appliedToTransaction", label:"UUID Anterior"})
                    let xmlCertificadoAnterior = result.getValue({name:"custbody_efx_fe_xml_file_ns",join: "appliedToTransaction", label:"PDF Anterior"})
                    let pdfTimbradoAnterior  = result.getValue({name:"custbody_efx_fe_pdf_file_ns",join: "appliedToTransaction", label:"XML  Anterior"})
                    // log.debug("[pdf,xml,pdfAnt,xmlAnte]",[pdfTimbrado,xmlCertificado,pdfTimbradoAnterior,xmlCertificadoAnterior])
                    let appliedtotransactionID = result.getValue({name:"appliedtotransaction"})
                    let appliedtotransaction = result.getText({name:"appliedtotransaction"})


                    /** Documentos Certificado y timbrado*/
                    let documentoPDF = "Sín documento PDF"
                    let documentoCertificado = "Sín documento certificado"

                    if( uuidAnterior != "") {
                        if(pdfTimbradoAnterior != "")
                            documentoPDF = urlGeneral + ((pdfTimbradoAnterior).split("id=")[1]).split("&")[0]
                        
                        if(xmlCertificadoAnterior != "")
                            documentoCertificado =  urlGeneral + ((xmlCertificadoAnterior).split("id=")[1]).split("&")[0] + "&des=1"

                    }else if (uuid != "") {
                        if(pdfTimbrado != "")
                            documentoPDF = urlGeneral + pdfTimbrado
                        
                        if(xmlCertificado != "")
                            documentoCertificado = urlGeneral + xmlCertificado + "&des=1"
                    }
                    /** Documentos */

                    // if(appliedtotransactionID in pagosPorFactura){
                    //     log.debug("Repetido: ", appliedtotransactionID)
                    // }

                    if( !(appliedtotransactionID in pagosPorFactura) )
                        pagosPorFactura[appliedtotransactionID] = []
                    
                    pagosPorFactura[appliedtotransactionID].push(
                        {
                            docNumber: tranid,
                            date: trandate,
                            amount: appliedtolinkamount,
                            invoice: appliedtotransaction,
                            pdfTimbrado : documentoPDF,
                            xmlCertificado : documentoCertificado
                        }
                    )
                    
                    
                    
                    /** -------------------------------------- */
                    
                    // let mainline = result.getValue({name:"mainline"})
                    // let trandate = result.getValue({name:"trandate"})
                    // let postingperiod = result.getText({name:"postingperiod"})
                    // let tranid = result.getValue({name:"tranid"})
                    // let appliedtotransaction = result.getText({name:"appliedtotransaction"})
                    // let appliedtotransactionID = result.getValue({name:"appliedtotransaction"})
                    // let account = result.getText({name:"account"})
                    // let amount = result.getValue({name:"amount"})
                    // let appliedtolinkamount = result.getValue({name:"appliedtolinkamount"})
                
                    // if (mainline == "*"){
                    //     pagosPorFactura[internalId] = {
                    //             docNumber: tranid,
                    //             date: trandate,
                    //             amount: amount
                    //         }
                    // }else{
                    //     if(!(internalId in listaPagosAplicados))
                    //         listaPagosAplicados[internalId] = []
                        
                    //     listaPagosAplicados[internalId].push(
                    //         {
                    //             id : appliedtotransactionID,
                    //             invoice : appliedtotransaction,
                    //             amount : appliedtolinkamount
                    //         }
                    //     ) 
                    // }
                    // if( !(alumnoId in pagosPorAlumnos) )
                    //     pagosPorAlumnos[alumnoId] = {}
                    
                    // pagosPorAlumnos[alumnoId][internalId] = []

                    /** --------------- */

                    i++; j++;
                    if(i > searchResultCount){
                        log.debug("Se esta pasando")
                        break
                    }
                    if( j== fin ) {   
                        j=0
                        currentRange = resultSet.getRange({
                           start : i,
                           end : i+fin
                        })
                    }
                }
                

                // let fileObj = file.create({
                //     name: 'pagosNuevos.json',
                //     fileType: file.Type.JSON,
                //     contents: JSON.stringify(pagosPorFactura)
                // });
                // fileObj.folder = 34487;
                // fileObj.save()
            return pagosPorFactura
            } catch (e) {
                log.debug("Pagos: " + e.name,e.message)
            }
        }
        const facturasAbiertas = (element) => {
            // TODO: Puntos a considerar de las facturas abiertas
            /**
             * Por el momento se estan considerando enviar en los estados de cuenta todas las facturas
             * por alumno que aparescan como abiertas, con el concepto Colegiatura A, Colegiatura A sep, colegiatura.
             * 
             * Punto que no estan considerados pero haran retrasos, existiran facturas abiertas pero con la posibilidad que ya se han pagado?
             * En caso de ser si el problema estara de como hacer referencia de que esa factura abierta ya tiene otra factura y ya esta pagada.
             */
            try {
                let facturasAbiertas= {}
                let listaArticulos = {}
                let saldos = {}
                let listaRecardo = {}

                var invoiceSearchObj = search.create({
                    type: "invoice",
                    filters:
                    [
                        ["type","anyof","CustInvc"], 
                        "AND", 
                        ["status","anyof","CustInvc:A"], 
                        "AND", 
                        ["customer.status","anyof","16","13"], 
                        "AND", 
                        ["taxline","is","F"], 
                        "AND", 
                        ["mainline","any",""], 
                        "AND", 
                        ["trandate","onorafter","01/01/2020"],
                        "AND",
                        ["item","noneof","176","172","4409","174","175","4293","4402","4401","4295"],
                        "AND", 
                        ["custbody_efx_alumno","anyof",alumnosClave]
                    ],
                    columns:
                    [
                       search.createColumn({
                          name: "ordertype",
                          sort: search.Sort.ASC,
                          label: "Order Type"
                       }),
                       search.createColumn({name: "internalId", label: "internalId"}),
                       search.createColumn({name: "mainline", label: "*"}),
                       search.createColumn({name: "trandate", label: "Date"}),
                       search.createColumn({name: "asofdate", label: "As-Of Date"}),
                       search.createColumn({name: "postingperiod", label: "Period"}),
                       search.createColumn({name: "taxperiod", label: "Tax Period"}),
                       search.createColumn({name: "type", label: "Type"}),
                       search.createColumn({name: "tranid", label: "Document Number"}),
                       search.createColumn({name: "entity", label: "Name"}),
                       search.createColumn({name: "account", label: "Account"}),
                       search.createColumn({name: "memo", label: "Memo"}),
                       search.createColumn({name: "amount", label: "Amount"}),
                       search.createColumn({name: "custbody_efx_fe_formapago", label: "EFX FE - Forma de Pago"}),
                       search.createColumn({name: "custbody_efx_fe_metodopago", label: "EFX FE - Método de Pago"}),
                       search.createColumn({name: "custbody_effx_uuid_factura_prov", label: "UUID DE LA FACTURA"}),
                       search.createColumn({name: "custbody_ref_banc", label: "Referencia Bancaria"}),
                       search.createColumn({name: "custbody_efx_cuenta_abono", label: "Cuenta de abono"}),
                       search.createColumn({name: "custbody_efx_alumno", label: "Alumno"}),
                       search.createColumn({name: "amountremainingisabovezero", label: "Amount Remaining is above 0"}),
                       search.createColumn({name: "item", label: "Item"}),
                       search.createColumn({name: "quantity", label: "Quantity"}),
                       search.createColumn({name: "amountremaining", label: "Amount Remaining"})
                    ]
                 });

                var searchResultCount = invoiceSearchObj.runPaged().count;
                let resultSet = invoiceSearchObj.run()
                let fin = 1000
                let currentRange = resultSet.getRange({
                    start : 0,
                    end : fin
                });
                let i = 0  
                let j = 0
                while ( j < currentRange.length ) {
                    let result = currentRange[j]
                    if (result.getValue({name:"custbody_efx_alumno"}) != '')
                    {
                        var alumnoId = result.getValue({name:"custbody_efx_alumno"})
                        // var padreId = result.getValue({name:"entity"})
                        var internalId = result.getValue({name:"internalId"})
                    }else{
                        i++; j++;
                        continue
                    }
                    
                    let mainline = result.getValue({name:"mainline"})
                    let trandate = result.getValue({name:"trandate"})
                    let postingperiod = result.getText({name:"postingperiod"})
                    let tranid = result.getValue({name:"tranid"})
                    let amount = result.getValue({name:"amount"})
                    let amountremaining = result.getValue({name:"amountremaining"})
                    
                    let saldorestante = parseFloat(amountremaining) || 0.0

                    if( alumnoId in saldos){
                        saldos[alumnoId].saldoPendiente += saldorestante,
                        saldos[alumnoId].saldoVencido += saldorestante
                        
                    }else{
                        saldos[alumnoId] = {
                            saldoPendiente : saldorestante,
                            saldoVencido : saldorestante,
                            facturas : []
                        }
                    }               
                    
                    if (mainline == "*"){
/** Validar por que no estan llegando mas de 1 factura en la lista que se envia a los estados  */
                        // log.debug("Facturas en saldos ", "facturas" in saldos[alumnoId])
                        // log.debug("Alumno ", alumnoId)
                        // if(!(internalId in saldos[alumnoId]["facturas"]))
                        //     saldos[alumnoId]["facturas"] = []
                        
                        // log.debug("Ahora ", "facturas" in saldos[alumnoId])
                        
                        // log.debug("Esta: " + internalId, internalId in saldos[alumnoId]["facturas"])
                        
                        saldos[alumnoId]["facturas"].push(internalId)
                        facturasAbiertas[internalId] = {
                            status: "Abierta",
                            idtransaction: internalId,
                            notransaction: tranid,
                            period:  postingperiod,
                            date: trandate,
                            totalamount: amount,
                            totalrecharge: 0.0,
                            detailsrecharge: [],
                            limiteDePago: {},
                            items: [],
                            creditNotes: [],
                            payments: []
                        }
                    }else{
                        let item = result.getText({name:"item"})
                        let itemId = result.getValue({name:"item"})
                        let quantity = result.getValue({name:"quantity"})
                        let amount = result.getValue({name:"amount"})
                        let description = result.getValue({name:"memo"}) 

                        // console.log(internalId)
                        if(!(internalId in listaArticulos))
                            listaArticulos[internalId] = []
                        
                        listaArticulos[internalId].push(
                            {
                                item:  item,
                                itemId: itemId,
                                quantity: quantity,
                                amount: amount,
                                description: description
                            }
                        )
                        // log.debug("Alumno: " + itemId, item)
                        if(itemId == '173'){
                            if(!(internalId in listaRecardo))
                                listaRecardo[internalId] = [0.0]
                            
                            listaRecardo[internalId].push(
                                {
                                    id: itemId,
                                    month: (new Date).getMonth() +1,
                                    amount: amount
                                }
                            )
                            // console.log(listaArticulos[internalId])
                            listaRecardo[internalId][0] += parseFloat(amount)
                        }
                    }

                    i++; j++;
                    if(i > searchResultCount){
                        log.debug("Se esta pasando")
                        break
                    }
                    if( j== fin ) {   
                        j=0
                        currentRange = resultSet.getRange({
                           start : i,
                           end : i+fin
                        })
                    }
                }
            
                let limitePago = fechaLimiteDePago()

                Object.keys(facturasAbiertas).map(element => {
                    if (element in listaArticulos)
                        facturasAbiertas[element].items = listaArticulos[element]
                    
                    facturasAbiertas[element].limiteDePago = limitePago
                    
                    if(element in listaRecardo){
                        facturasAbiertas[element].detailsrecharge = listaRecardo[element]
                        facturasAbiertas[element].totalrecharge = listaRecardo[element][0]
                        listaRecardo[element].shift()
                    }
                })
                
                return {facturas: facturasAbiertas, saldos: saldos}

            } catch (e) {
                log.debug("Facturasbiertas: " + e.name , e.message)
            }
        }
        const estadosPorAlumnos = () => {
            try {
                let customrecord_tkio_recordworkorderSearchObj = search.create({
                    type: "customrecord_tkio_estadocuenta_innfamily",
                    filters:
                    [
                    ["custrecord_tkio_estadocuenta_enviado","is",false],
                    ],
                    columns:
                    [
                    search.createColumn({
                        name: "scriptid",
                        sort: search.Sort.ASC,
                        label: "Script ID"
                    }),
                    ]
                })
                let searchResultCount = customrecord_tkio_recordworkorderSearchObj.runPaged().count;
                log.debug("contaddor: ", searchResultCount)
                var registros = customrecord_tkio_recordworkorderSearchObj.run()
                // var listResponse = []
                registros.each( function(result) {
                    // log.debug("cada: ", result)
            
                    // you have the result row. use it like this....
                    
                    try {
                        var res = record.delete({
                            type: "customrecord_tkio_estadocuenta_innfamily",
                            id: result.id,
                        });
                        
                        // listResponse.push( {id:result.id,result:true,count:searchResultCount,data:res});
                    } catch (e) {
                        // listResponse.push( {id:result.id,result:false,count:searchResultCount,data:e.message});
                    }
                    
                    // don't forget to return true, in order to continue the loop
                    return true;  
            
                });
                // return listResponse    
            } catch (e) {
                log.debug("Error",e)
            }
        }

        return {fechaLimiteDePago, saldosAFavor, pagosAplicados ,notasDeCredito, facturasAbiertas}

    });
