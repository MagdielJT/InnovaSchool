/**
 * @NApiVersion 2.1
 */
define(['N/search','./helpersFamily.js'],
    /**
 * @param{search} search
 */
    (search,helperMain) => {
        
        const saldosAFavor = () => {
            let padreSaldoFavor = {}
        try {
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
            let cuentaTotal = listadeClientes.runPaged().count
            log.debug({
                title: "Cantidad de casos con saldo a favor",
                details: cuentaTotal
            })
            if ( cuentaTotal !== 0) {
                listadeClientes.run().each(function(result){
                let padreId = result.getValue({name:'custrecord_tkio_saldo_afavor_clitneteid'})
                let alumnoid = result.getValue({name:'custrecord_tkio_saldo_hijoid'})

                if(padreId == "" || alumnoid == "")  return false

                let padreNombre = result.getText({name:'custrecord_tkio_saldo_afavor_clitneteid'})
                let alumnoNombre = result.getText({name:'custrecord_tkio_saldo_hijoid'})
                let monto = parseFloat( result.getValue({name:'custrecord_tkio_saldo_padre_monto'}) )

                if ( monto <= 0.0 || isNaN(monto) ) return false
                        
                if (!(padreId in padreSaldoFavor)) {
                    padreSaldoFavor[padreId] = {nombre:padreNombre,hijos:[]}
                }
                padreSaldoFavor[padreId].hijos.push( { id:alumnoid,nombre:alumnoNombre,monto } )

                return true
                })
            }
            return padreSaldoFavor

            } catch (e) {
                log.debug("busquedag: Error en la busqueda de saldos a favor",e)
                return e.details || e.message || e.toString()
                
            }
        }
        const saldosAdeudados = (element,min,max) => {
            try {
                let total = 0.0
                let padreSaldoAdeudado = {}
                var clienteSaldoPendiente = search.create({
                    type: search.Type.INVOICE,
                    filters:
                    [
                        ["type","anyof","CustInvc"], 
                        "AND", 
                        ["status","anyof","CustInvc:A"],
                        "AND",
                        ["amountremaining","greaterthan","4.99"],
                        "AND",
                        ["trandate","within",min,max], 
                        "AND", 
                        ["custbody_efx_alumno","anyof",element]
                    ],
                    columns:
                    [
                    search.createColumn({
                        name: "ordertype",
                        sort: search.Sort.DESC,
                        label: "Tipo de purchase order"
                    }),
                    search.createColumn({name: "trandate", label: "Fecha"}),
                    search.createColumn({name: "asofdate", label: "Fecha inicial"}),
                    search.createColumn({name: "postingperiod", label: "Período"}),
                    search.createColumn({name: "taxperiod", label: "Período fiscal"}),
                    search.createColumn({name: "type", label: "Tipo"}),
                    search.createColumn({name: "tranid", label: "Número de documento"}),
                    search.createColumn({name: "entity", label: "Nombre"}),
                    search.createColumn({name: "account", label: "Cuenta"}),
                    search.createColumn({name: "amountremaining", label: "Importe restante"}),
                    search.createColumn({name: "payingamount", label: "Importe a pagar"}),
                    search.createColumn({name: "custbody_efx_alumno", label: "Alumno"}),
                    search.createColumn({name: "amount", label: "Importe"})
                    ]
                });
                var searchResultCount = clienteSaldoPendiente.runPaged().count;
                // log.debug("Saldos con deuda",searchResultCount);
                //  let i = 0
                let resultSet = clienteSaldoPendiente.run()
                let fin = 30
                let currentRange = resultSet.getRange({
                    start : 0,
                    end : fin
                });
                let i = 0  
                let j = 0  
                while ( j < currentRange.length ) {
                    let result = currentRange[j]
                    let son = result.getValue({name:'custbody_efx_alumno'})
                    total += parseFloat(result.getValue({name:'amountremaining'}))
                    if ( son in padreSaldoAdeudado){
                        padreSaldoAdeudado[son].totalamount += parseFloat(result.getValue({name:'amountremaining'}))
                    }else{
                        padreSaldoAdeudado[son] = {
                            name : result.getText({name:'custbody_efx_alumno'}),
                            totalamount : parseFloat(result.getValue({name:'amountremaining'}))
                        }
                        
                    }
                    i++; j++;
                    if(i == 8000){
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
                return [padreSaldoAdeudado,total]
            } catch (e) {
                log.debug({
                    title: "Error de Saldos Con Deuda",
                    details: e
                })
            }
        }
        return {saldosAFavor, saldosAdeudados}

    });
