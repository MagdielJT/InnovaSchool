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

        function getInputData()
        {
            try{

                var customerSearchObj = search.create({
                    type: "customer",
                    filters:
                        [
                            ["category","anyof","2"],
                            "AND",
                            ["status","anyof","13"],

                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "entityid",
                                sort: search.Sort.ASC,
                                label: "ID"
                            }),
                            search.createColumn({name: "pricelevel", label: "Nivel de precio"}),
                            search.createColumn({name: "internalid", label: "ID interno"}),
                            search.createColumn({name: "subsidiary", label: "Subsidiaria primaria"}),
                            search.createColumn({name: "custentity_efx_ip_campus", label: "location"}),
                            search.createColumn({name: "parent", label: "parent"}),
                            search.createColumn({name: "custentity_efx_ip_level", label: "level"}),
                            search.createColumn({name: "custentity_efx_ip_ecurp", label: "level"}),

                        ]
                });

                var searchResultCount = customerSearchObj.runPaged().count;
                log.audit({title: 'map - getdata resultados', details: searchResultCount});
                return customerSearchObj;


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
                log.audit({title: 'map - data', details: data});

                var Alumno = data.internalid.value;
                var Ubicacion = data.custentity_efx_ip_campus.value;
                var Nivel = data.custentity_efx_ip_level.value;

                var IPREVOE;

                    var customrecord_efx_ip_rvoeSearchObj = search.create({
                        type: "customrecord_efx_ip_rvoe",
                        filters:
                            [
                                ["custrecord_efx_ip_level_study","anyof",Nivel],
                                "AND",
                                ["custrecord_efx_ip_location","anyof",Ubicacion]
                            ],
                        columns:
                            [
                                search.createColumn({name: "custrecord_efx_ip_rvoe_field", label: "IP - RVOE"})
                            ]
                    });
                    var searchResultCount = customrecord_efx_ip_rvoeSearchObj.runPaged().count;
                    log.debug("customrecord_efx_ip_rvoeSearchObj result count",searchResultCount);
                    customrecord_efx_ip_rvoeSearchObj.run().each(function(result){
                        IPREVOE = result.getValue({name: "custrecord_efx_ip_rvoe_field"});
                        return true;
                    });
                    log.audit({title: 'map - IPREVOE', details: IPREVOE});
				var customrecord_efx_db_txt_referenciaSearchObj = search.create({
                    type: "customrecord_efx_db_txt_referencia",
                    filters:
                        [
                            ["custrecord_efx_db_ref_customer","anyof",data.internalid.value],
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
 log.audit({title: 'map - referencia', details: referencia});

                var ModCust = record.load({type: "customer",id: Alumno , isDynamic:true});
                    ModCust.setValue({fieldId:'custentity_efx_ip_rvoealumno',value:IPREVOE });
            	    ModCust.setValue({fieldId:'custentity_tkio_ref_banc',value:referencia });
                var ModCustSave = ModCust.save();
                log.audit({title: 'ModCustSave', details: ModCustSave});
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