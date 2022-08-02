/**
 * @NApiVersion 2.1
 */
define(['N/record','N/search'],
    /**
 * @param{record} record
 */
    (record,search) => {

        const guardarEstados = (element) => {
            try {
                let main = element
                let alumno = element.idstudent
                let adeudo = element.outstanding
                let transacciones = element.transactions
                let numero =  transacciones.length - 1
                let abiertas = false
                transacciones.map( (n,i) => {
                    let pagada = n.status == "Pagada" ? true : false
                    if (!pagada)
                        abiertas = true
                    
                    let salvandoFacturas = record.create({
                        type: 'customrecord_tkio_estadocuenta_innfamily',
                        isDynamic: true,
                    })
                        salvandoFacturas.setValue({
                            fieldId: 'name',
                            value: alumno
                        })
                        salvandoFacturas.setValue({
                            fieldId: 'custrecord_tkio_cliinnovafam',
                            value: alumno
                        })
                        salvandoFacturas.setValue({
                            fieldId: 'custrecord_tkio_estadocuenta_enviado',
                            value: false
                        })
                        salvandoFacturas.setValue({
                            fieldId: 'custrecord_tkio_estadocuenta_completo',
                            value: pagada
                        })
                        salvandoFacturas.setValue({
                            fieldId: 'custrecord_tkio_estadocuenta_innovaf',
                            value: JSON.stringify(n)
                        })
                    salvandoFacturas.save();

                    if(numero == i){
                        main.transactions = []
                    }
                })

                let salvandoMain = record.create({
                        type: 'customrecord_tkio_estadocuenta_innfamily',
                        isDynamic: true,
                    })
                    salvandoMain.setValue({
                        fieldId: 'name',
                        value: alumno
                    })
                    salvandoMain.setValue({
                        fieldId: 'custrecord_tkio_cliinnovafam',
                        value: alumno
                    })
                    salvandoMain.setValue({
                        fieldId: 'custrecord_tkio_estadocuenta_enviado',
                        value: false
                    })
                    salvandoMain.setValue({
                        fieldId: 'custrecord_tkio_estadocuenta_completo',
                        value: abiertas
                    })
                    salvandoMain.setValue({
                        fieldId: 'custrecord_tkio_estadocuenta_innovaf',
                        value: JSON.stringify(main)
                    })
                    salvandoMain.setValue({
                        fieldId: 'custrecord_tkio_montoadeudadoinnova',
                        value: adeudo
                    })
                    if(main.transactions.length == 0){
                        salvandoMain.setValue({
                            fieldId: 'custrecord_estimado_if',
                            value: true
                        })
                    }
                salvandoMain.save();
            } catch (e) {
                log.debug(e.name,e.message)
            }
        }

        const borrar = (element) => {
            try {
                // log.debug(requestBody)
                // let opc = {
                //     "success" : "T",
                //     "fails" : "F"
                // }
                // log.debug("ddd",opc[requestBody.action])
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
                var delRecords = customrecord_tkio_recordworkorderSearchObj.run()
                // var listResponse = []
                delRecords.each( function(result) {
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

        return {guardarEstados,borrar}

    });
