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
 
                var invoiceSearchObj = search.create({
                    type: "invoice",
                    filters:
                        [
                            ["type","anyof","CustInvc"],
                            "AND",
                            ["status","anyof","CustInvc:D","CustInvc:A"],
                            "AND",
                            ["item","is","168"],
                          	"AND", 
   						  	["custbody_ref_banc","isempty",""]

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
              
              	/*var pagedData = invoiceSearchObj.runPaged({
                      pageSize: 100
                  });
              log.audit({title: 'getInputData - results', details: pagedData.count});*/

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
        {Andy
            try{
              log.debug({title: ' map', details: context});
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
                var data = JSON.parse(context.values[0]);
                log.debug({title: 'map - reduce', details: data});
                var referencia;
                var customrecord_efx_db_txt_referenciaSearchObj = search.create({
                    type: "customrecord_efx_db_txt_referencia",
                    filters:
                        [
                            ["custrecord_efx_db_ref_customer","anyof",data.custbody_efx_alumno.value],
                            "AND",
                            ["custrecord_efx_db_ref_item","anyof","168"]
                        ],
                    columns:
                        [
                            search.createColumn({name: "custrecord_efx_db_ref_ref", label: "Referencia"})
                        ]
                });

                customrecord_efx_db_txt_referenciaSearchObj.run().each(function(result){
                    referencia = result.getValue({name: "custrecord_efx_db_ref_ref"  });
                    return true;
                });
                log.debug({title: 'reduce - referencia', details: referencia});


              
              
              		var id = record.submitFields({
                        type: record.Type.INVOICE,
                        id: data.internalid.value,
                        values: {
                            custbody_ref_banc: referencia
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields : true
                        }
                    });
                /*var ModInvo = record.load({type: record.Type.INVOICE,id: data.internalid.value , isDynamic:true});
                ModInvo.setValue({fieldId:'custbody_ref_banc',value:referencia });
                var ModInvosave = ModInvo.save();*/
                log.audit({title: 'id', details: id});
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