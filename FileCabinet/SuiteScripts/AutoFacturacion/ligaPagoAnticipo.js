/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */

    /** 
     * Consideraciones:
     * 
     * Revisar si existen anticipos pagos para la factura de colegiatura.
     * Si existe algún anticipo edita el pago y coloca la referencia de la factura en un campo llamado “Factura relacionada”.
     * Se validará el monto del anticipo si es menor o mayor al de la factura de colegiatura:
     * Si es mayor permitirá ligar más de una factura al pago.
     * Si es menor solo permitirá ligar una factura al pago.
     * Los montos deben coincidir con lo que se ha pagado de la factura de colegiatura en el estado de cuenta que se devuelve a Innova Family.
     * 
     * Se implementará un User Event aplicado a la factura 
    */
    (record, search) => {
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
                /** Datos de TXt Detalle 
                 * El campo Factura esta timbrada pero no se requiere enviar a Innova Family ; Cuenta depositos
                 *  El pago relacionado a esta factura si lo ocuparemos.
                 * El campo pago es el pago de aplicacion de esta deuda; Cuenta Anticipos
                 *  Este pago no se enviara a Innova Family, pero contiene las facturas que si se enviaran.
                 * 
                 * El punto de este Script es Ligar facturas con pagos que se estaran enviado a Innova Family:
                 *      //TODO: Crear busqueda guardada sobre el valor del campo Factura, extraer el pago aplicado y almacenar en variable. 
                 *      //TODO: Crear busqueda guardada sobre el valor del campo pago de  este detalle, una vez encontrada la 
                 *            factura se abrira el registro y en el campo "liga de pago" sombre la factura encontrada se 
                 *            llenara con el pago obtenido de la busqueda anterior.
                */
                
                var datosTransaccion = scriptContext.newRecord
                let factura = datosTransaccion.getValue({fieldId:"custrecord_efx_db_invoice"})
                log.debug("Factura: ", factura)
                let pago = datosTransaccion.getValue({fieldId:"custrecord_efx_db_payment"})
                log.debug("Pago: ", pago)

                /* Creating a search object. */
                let pagoDeFacturaDeposito = search.create({
                    type: "invoice",
                    filters: [ ["mainline","is","T"],"AND",[ "internalid", "anyof", factura ] ],
                    columns: search.createColumn({name: "applyingtransaction", label: "Applying Transaction"})
                })
                let facturasALigar = search.create({
                    type: "customerpayment",
                    filters: [ ["mainline","is","F"],"AND",[ "internalid", "anyof", pago ] ],
                    columns: search.createColumn({name: "appliedtotransaction", label: "Applied To Transaction"})
                })
                /** Factura Deposito */
                /* Counting the results of the search. */
                let resultadosBusquedaPDFD = pagoDeFacturaDeposito.runPaged().count;
                log.debug("Resultados, Contador: ",resultadosBusquedaPDFD);
                /* The above code is running a saved search. */
                let pagoReal = []
                pagoDeFacturaDeposito.run().each(function(result){
                    log.debug("Resultados, datos: ", result)
                    pagoReal.push(result.getValue({name:"applyingtransaction"}))
                    pagoReal.push(result.getText({name:"applyingtransaction"}))
                    return true
                })

                /** Pagos Anticipos */
                /* Counting the results of the search. */
                let resultadosBusquedaFAL = facturasALigar.runPaged().count;
                log.debug("Resultados, Contador: ",resultadosBusquedaFAL);
                /* The above code is running a saved search. */
                let facturaReal = []
                facturasALigar.run().each(function(result){
                    log.debug("Resultados, facturas: ",result)
                    facturaReal.push(result.getValue({name:"appliedtotransaction"}))
                    return true
                })

                let actualizarFactura = record.load({
                    type: "invoice",
                    id: facturaReal[0]
                }) 
                actualizarFactura.setValue({
                    fieldId: "custbody_tkio_ligadepagotxtdetalle",
                    value: pagoReal[1]
                })
                actualizarFactura.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                })              

            } catch (e) {
                log.debug(e.name, e.message)
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
