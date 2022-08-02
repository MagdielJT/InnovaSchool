/**
 * @NApiVersion 2.1
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    (search) => {
        const chunkFacts = (element) => {
         let perChunk = 500
         let chunkPorFacturas =  element.reduce((resultArray, item, index) => { 
            const chunkIndex = Math.floor(index/perChunk)
               
            if(!resultArray[chunkIndex]) {
               resultArray[chunkIndex] = [] 
            }
               
            resultArray[chunkIndex].push(item)
               
            return resultArray
         }, [])
         // log.debug("Tamaño de chunk en facturas:",chunkPorFacturas)
         return chunkPorFacturas
        }
        const getItems = (element) => {
            
            let chunkPorFacturas = chunkFacts(element)
            let listaPorFactura = {}
            
            chunkPorFacturas.forEach(elementChunk => {
               var invoiceSearchObj = search.create({
                  type: "invoice",
                  filters:
                  [
                    ["type","anyof","CustInvc"],
                    "AND",
                    ["internalid","anyof",elementChunk],
                    "AND", 
                    ["mainline","anyof",""],
                    "AND", 
                    ["taxitem","anyof","26"]
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
                     search.createColumn({name: "account", label: "Cuenta"}),
                     search.createColumn({name: "memo", label: "Nota"}),
                     search.createColumn({name: "amount", label: "Importe"}),
                     search.createColumn({name: "statusref", label: "Estado"}),
                     search.createColumn({name: "item", label: "Articulos"}),
                     search.createColumn({name: "quantity", label: "Cantidad"}) 
                  ]
               });
              var searchResultCount = invoiceSearchObj.runPaged().count;
              
              invoiceSearchObj.run().each(function(result){

                 let idInterno = result.getValue({name:"internalid"})
                 if( idInterno in listaPorFactura ){
                    listaPorFactura[idInterno].push(
                       {
                          item: result.getText({name:"Item"}),
                          quantity: result.getValue({name:"quantity"}),
                          amount: result.getValue({name:"amount"}),
                          description: result.getValue({name:"memo"})
                       }
                    )
                 }else{
                    listaPorFactura[idInterno] = [{
                     item: result.getText({name:"Item"}),
                     quantity: result.getValue({name:"quantity"}),
                     amount: result.getValue({name:"amount"}),
                     description: result.getValue({name:"memo"})
                  }]
                 }
                 return true;
              });
            });
            return listaPorFactura

        }

        const getPagos = (element) => {
         let pagosPorFactura = {}
         // log.debug("Tamño añterado,", element.length)
         let chunkPorFacturas = chunkFacts(element)
         chunkPorFacturas.forEach(elementChunk => {
            var customerpaymentSearchObj = search.create({
               type: "customerpayment",
               filters:
               [
                  ["type","anyof","CustPymt"], 
                  "AND", 
                  ["mainline","is","F"], 
                  "AND", 
                  ["appliedtotransaction","anyof",elementChunk]
               ],
               columns:
               [
                  search.createColumn({name: "tranid", label: "Document Number"}),
                  search.createColumn({name: "trandate", label: "Fecha"}),
                  search.createColumn({name: "custbody_efx_alumno", label: "Alumno"}),
                  search.createColumn({name: "appliedtotransaction", label: "Applied To Transaction"}),
                  search.createColumn({name: "amount", label: "Amount"})
               ]
            });
            var searchResultCount = customerpaymentSearchObj.runPaged().count;
            // log.debug("customerpaymentSearchObj result count",searchResultCount);
            customerpaymentSearchObj.run().each(function(result){
               // .run().each has a limit of 4,000 results
               let idInterno = result.getValue({name:"appliedtotransaction"})
               if( idInterno in pagosPorFactura ){
                  pagosPorFactura[idInterno].list.push(
                     {
                        amount: result.getValue({name:"amount"})
                     }
                  )
               }else{
                  pagosPorFactura[idInterno] = {
                     docNumber : result.getValue({name:"tranid"}),
                     date : result.getValue({name:"trandate"}),
                     invoice: result.getText({name:"appliedtotransaction"}),
                     list : [{
                        amount: result.getValue({name:"amount"})
                     }]
                  }
                  
               }
               return true;
            });
         })
         return pagosPorFactura
        }

        const getNotasCredito = (element) => {
         let chunkPorFacturas = chunkFacts(element)
         let listaNotaPorFactura = {}
         let returnValue = 0
         let total = 0

         chunkPorFacturas.forEach(elementChunk => {
         var creditmemoSearchObj = search.create({
            type: "creditmemo",
            filters:
            [
               ["type","anyof","CustCred"], 
               "AND", 
               ["createdfrom","anyof",elementChunk],
               "AND", 
               ["mainline","anyof",""],
               // "AND", 
               // ["taxitem","anyof","26"]
            ],
            columns:
            [
               search.createColumn({
                  name: "ordertype",
                  sort: search.Sort.ASC,
                  label: "Tipo de purchase order"
               }),
               search.createColumn({name: "createdfrom", label: "Creado desde"}),
               search.createColumn({name: "internalid", label: "id"}),
               search.createColumn({name: "mainline", label: "*"}),
               search.createColumn({name: "trandate", label: "Fecha"}),
               search.createColumn({name: "asofdate", label: "Fecha inicial"}),
               search.createColumn({name: "postingperiod", label: "Período"}),
               search.createColumn({name: "taxperiod", label: "Período fiscal"}),
               search.createColumn({name: "type", label: "Tipo"}),
               search.createColumn({name: "tranid", label: "Número de documento"}),
               search.createColumn({name: "entity", label: "Nombre"}),
               search.createColumn({name: "account", label: "Cuenta"}),
               search.createColumn({name: "memo", label: "Nota"}),
               search.createColumn({name: "amount", label: "Importe"}),
               search.createColumn({name: "custbody_efx_alumno", label: "Alumno"}),
               search.createColumn({name: "item", label: "Articulos"}),
               search.createColumn({name: "quantity", label: "Cantidad"}),
               search.createColumn({name: "fxrate", label: "Tasa de artículo"}),
               // search.createColumn({name: "appliedtolinktype", label: "Aplicado al tipo de vínculo"}),
               // search.createColumn({name: "reimbursableamount", label: "Importe reembolsable"})
            ]
         });
         var searchResultCount = creditmemoSearchObj.runPaged().count;
         // log.debug("Resultado nota",searchResultCount);
         
         creditmemoSearchObj.run().each(function(result){
            let idInterno = result.getValue({name:"createdfrom"})
            let amount = result.getValue({name:"amount"})
            if( idInterno in listaNotaPorFactura ){
                  listaNotaPorFactura[idInterno].lista.push(
                     {
                        item: result.getText({name:"Item"}),
                        quantity: result.getValue({name:"quantity"}),
                        amount: (amount * -1),
                        description: result.getValue({name:"memo"})
                     }
                  )
               }else{
                  total += parseFloat(amount)
                  listaNotaPorFactura[idInterno] = {
                     docNumber : result.getValue({name:"tranid"}),
                     date : result.getValue({name:"trandate"}),
                     lista : []
                  }
                  
               }
               return true;
            });
         })
            return listaNotaPorFactura
         }
         
        return {getItems,getPagos,getNotasCredito}

    });
