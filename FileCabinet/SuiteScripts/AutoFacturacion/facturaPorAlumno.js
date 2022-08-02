/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record','N/search','N/file'],
    /**
 * @param{record} record
 */
    (record,search,file) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            try {
                /** Se aplicará a facturas a crear y editar */
                if([scriptContext.UserEventType.EDIT,scriptContext.UserEventType.CREATE].includes(scriptContext.type)){
                    var datosTransaccion = scriptContext.newRecord
                    var alumno = datosTransaccion.getValue({fieldId:"custbody_efx_alumno"})

                    var customerSearchObj = search.create({
                        type: "customer",
                        filters:
                    [
                        /** Las busqueda dependera de que la categoría del cliente sea ALUMNO y el id del cliente debe estar incluido. */
                        ["category","anyof","2"],
                        "AND",
                        ["internalid","is",alumno]
                    ],
                    columns:
                    [
                    search.createColumn({
                        name: "entityid",
                        sort: search.Sort.ASC,
                        label: "ID"
                    }),
                        search.createColumn({name: "altname", label: "Nombre"}),
                        search.createColumn({name: "custentity_mx_rfc", label: "RFC"}),
                        search.createColumn({name: "custentity_efx_mx_cfdi_usage", label: "Uso de CFDI"}),
                        search.createColumn({name: "country", label: "pais"}),
                        search.createColumn({name: "attention", label: "aten"}),
                        search.createColumn({name: "billaddress", label: "billaddress"}),
                        search.createColumn({name: "addressee", label: "destinatario"}),
                        search.createColumn({name: "isdefaultbilling", label: "destinatario final"})
                        ]
                    });
                    var searchResultCount = customerSearchObj.runPaged().count;
                    // log.debug("customerSearchObj result count",searchResultCount);
                    
                    /** Se establecara que si el alumno no cuenta con un rfc valido, se asignara uno rfc generico */
                    var datosAlumno = {rfc:'XAXX010101100'}
                    
                    if (searchResultCount > 0){
                        customerSearchObj.run().each(function(result){
                            // log.debug("Valores: ", result)
                            // .run().each has a limit of 4,000 results
                            /** Para los casos de cfdi y direccion, si el cliente no cuenta con estos datos se mantendran los datos del cliente padre. */
                            var rfc = result.getValue({name:'custentity_mx_rfc'})
                            var cfdi = result.getValue({name:'custentity_efx_mx_cfdi_usage'})

                            datosAlumno.rfc = rfc != '' ? rfc : 'XAXX010101000'
                            
                            if(cfdi != '')
                                datosAlumno.cfdi = cfdi

                            // log.debug("Tiene direccion por default: ", result.getValue({name:"isdefaultbilling"}))
                            /** PAra establecer la nueva direccion de facturacion, el cleinte debera contar con una direccion marcada con el check defaultbilling
                             * De lo contrario se establecera la direccion de facturacion por default de "Publico General"
                             */
                            if(result.getValue({name:"isdefaultbilling"})){
                                var address = result.getValue({name:'billaddress'})
                                var addressee = result.getValue({name:'addressee'})
                                var attention = result.getValue({name:'attention'})
                                datosAlumno.billAddress = address
                                datosAlumno.addressee = addressee
                                datosAlumno.attention = attention
                            }

                            return true
                        });   
                    }
                    /**
                     * Punto a considerar sobre el uso de CFDI:
                     *  Si no es un uso de CFDI indicado al registro de regimen dara error al intentar timbrar
                     *  ID 21, Servicios estuduantiles es el indicado para Innova
                     *  Casos de CFDI con error: Gaston en General.
                     */
                    if("cfdi" in datosAlumno)
                        datosTransaccion.setValue({fieldId:'custentity_efx_mx_cfdi_usage',value:datosAlumno.cfdi})
                        datosTransaccion.setValue({fieldId:'custbody_mx_cfdi_usage',value:datosAlumno.cfdi})
                    
                    datosTransaccion.setValue({fieldId:'custbody_mx_customer_rfc',value:datosAlumno.rfc})
                    datosTransaccion.setValue({fieldId:'custbody_tk_rfc_lm',value:datosAlumno.rfc})
                    

                    var subRecordAddress = datosTransaccion.getSubrecord({
                        fieldId: "billingaddress"
                    })
                    
                    // log.debug("Datos de la fecha: ", subRecordAddress)
                    // log.debug("ultima reviion: ", datosAlumno)

                    if("billAddress" in datosAlumno){

                        log.debug("*-*-*-*-*-*- SI",datosAlumno.billAddress)
                        
                        log.debug("*-*-*-*-*-*- Adresee",datosAlumno.addressee)
                        
                        subRecordAddress.setValue({fieldId:'billaddresslist',value:-2})
                        subRecordAddress.setValue({fieldId:'billaddress',value:datosAlumno.billAddress})
                        subRecordAddress.setValue({fieldId:"addressee",value:datosAlumno.addressee})
                    }else{
                        subRecordAddress.setValue({fieldId:'billaddress',value:"Publico en General"})
                        subRecordAddress.setValue({fieldId:'addressee',value:"Publico en General"})
                    }
                    if("attention" in datosAlumno)
                        subRecordAddress.setValue({fieldId:"attention",value:datosAlumno.attention})
                    
                }
            } catch (e) {
                log.debug(e.name,e.message)
            }
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            
           
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
