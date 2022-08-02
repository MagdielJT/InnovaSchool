/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/error','N/record','N/runtime', 'N/search','N/format'],
    /**
     * @param {email} email
     * @param {error} error
     * @param {record} record
     * @param {runtime} runtime
     * @param {search} searchaa
     */
    function(error, record, runtime, search, format)
    {

        /**
         * Map/Reduce Script:
         * Sample Map/Reduce script for blog post.
         */


        /**
         * Marks the beginning of the Map/Reduce process and generates input data.
         *
         * @typedef {Object} ObjectRef
         * @property {number} id - Internal ID of the record instance
         * @property {string} type - Record type id
         *
         * @return {Array|Object|Search|RecordRef} inputSummary
         * @since 2015.1
         */
            //var count;
        var Ides = [];
        function getInputData()
        {
            try{
                var redondeo = record.load({
                    type: 'customrecord_tkio_redondeo',
                    id: 1,
                    isDynamic: true
                });

                var ValorR = redondeo.getValue({fieldId:'custrecord_tkio_monto_ignorar'});

                log.audit({ title: 'ValorR ',
                    details: ValorR})
                var invoiceSearchObj = search.create({


                    type: "invoice",
                    filters:
                        [
                            ["type","anyof","CustInvc"],
                            "AND",
                            ["status","anyof","CustInvc:D","CustInvc:A"],
                            "AND",
                            ["item.internalid","anyof","168"],
                            "AND",
                            ["amount","greaterthan",ValorR],
                           /* "AND",
                            ["trandate","within","thismonth"]*/
                        ],
                    columns:
                        [
                            search.createColumn({name: "internalid", label: "ID interno"}),
                            search.createColumn({
                                name: "altname",
                                join: "customer",
                                label: "Nombre"
                            }),
                            search.createColumn({name: "custbody_efx_alumno", label: "Alumno"}),
                            search.createColumn({name: "amount", label: "Importe"}),
                            search.createColumn({
                                name: "internalid",
                                join: "customer",
                                label: "ID interno"
                            })
                        ]
                });
                var searchResultCount = invoiceSearchObj.runPaged().count;
                log.debug("invoiceSearchObj result count",searchResultCount);

                return invoiceSearchObj;

            }catch (e) {

                log.audit({
                    title: 'Error ',
                    details: e
                });
            }


        }

        /**
         * Executes when the map entry point is triggered and applies to each key/value pair.
         *
         * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
         * @since 2015.1
         */
        function map(context)
        {
            try{
              log.audit({ title: 'map ',
                    details: context});
                var datos = JSON.parse(context.value);


                var peticion = datos.id;
                context.write({
                    key: peticion,
                    value: datos.values
                });


            } catch (e) {
                log.audit({
                    title: 'Error ',
                    details: e
                });
            }

        }

        /**
         * Executes when the summarize entry point is triggered and applies to the result set.
         *
         * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
         * @since 2015.1
         */
        function reduce(context)
        {
            try{
                const fecha = new Date();
                var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
                var mesnow = fecha.getMonth()+1;
                var dianow  = fecha.getDate();
                var recargo = record.load({
                    type: 'customrecord_efx_recargos',
                    id: mesnow,
                    isDynamic: true
                });


                var Json2 = JSON.parse((context.values[0]));

                log.audit({ title: 'JSON ',
                    details: Json2});

               var monto = (parseFloat(recargo.getValue({fieldId:'custrecord_efx_reg_porcentaje' })) * (parseFloat(Json2.amount)/100)).toFixed(2);
                var dia = recargo.getValue({fieldId:'custrecord_efx_reg_dias'})
                Json2["parent"] = Json2["internalid.customer"];
                delete Json2["internalid.customer"];

                log.audit({
                    title: 'Json2 ',
                    details: Json2
                });
                log.debug("Json2",Json2);
                log.debug("Json2.internalid.value",Json2.internalid.value);
                log.debug("dianow",dianow);
                log.debug("dia",dia);
                if(dianow > 0 ){

                    var registro = record.create({type: 'customrecord_tkio_registro_recargo', isDynamic:true});
                    registro.setValue({fieldId:'custrecord_tkio_cantidad_recargos',value: monto});
                    log.debug("monto",monto);
                    registro.setValue({fieldId:'custrecord_tkio_meses_recargo',value: mesnow });
                    log.debug("mesnow",mesnow);
                    registro.setValue({fieldId:'custrecord_recargo_id_cliente',value: Json2.parent.value });
                    log.debug("Json2.parent.value",Json2.parent.value);
                    registro.setValue({fieldId:'custrecord_tkio_hijo_name',value: Json2.custbody_efx_alumno.value });
                    log.debug("Json2.custbody_efx_alumno.value",Json2.custbody_efx_alumno.value);
                    registro.setValue({fieldId:'custrecord_tkio_factura_origen',value: Json2.internalid.value });
                    log.debug("Json2.internalid.value",Json2.internalid.value);
                    var salvador = registro.save();
                    log.debug("salvador",salvador);
                }


            } catch (e) {

                log.audit({
                    title: 'error ',
                    details: e
                });
            }

        }


        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
        };

    });