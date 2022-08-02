/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/log', 'N/record', 'N/search','N/runtime','N/task', 'N/format', 'N/url','N/https', './moment.js', 'N/config'],
    /**
     * @param{log} log
     * @param{record} record
     * @param{search} search
     */
    (log, record, search, runtime,task,format, urlMod, https, moment, config) => {
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
            var custscript_efx_db_id_detail = runtime.getCurrentScript().getParameter({name: 'custscript_efx_db_id_detail'});
            log.debug({title: 'getInputData - custscript_efx_db_id_detail ', details: custscript_efx_db_id_detail});

            try {

                var filters = [
                    ['isinactive', search.Operator.IS, 'F']
                    , 'and',
                    ['custrecord_efx_db_processed', search.Operator.IS, 'F']
                    , 'and',
                    ['custrecord_efx_db_abono', search.Operator.IS, 'T']
                ];

                if(custscript_efx_db_id_detail){
                    filters.push('and');
                    filters.push(['custrecord_efx_db_tb', search.Operator.IS, custscript_efx_db_id_detail]);
                }

                /*filters.push("AND");
                filters.push([
                    ['internalid', search.Operator.IS, 4110],
                   /* "OR",
                    ['internalid', search.Operator.IS, 3018],
                    "OR",
                    ['internalid', search.Operator.IS, 3021],
                ]);*/

                log.debug({title: 'getInputData - filters ', details: filters});
                var busqueda_lineas = search.create({
                    type: 'customrecord_efx_db_txt_detalle',
                    filters: filters,
                    columns: [

                        search.createColumn({name: 'internalid'}),
                        search.createColumn({name: 'custrecord_efx_db_tb'}),
                        search.createColumn({name: 'custrecord_efx_db_line'}),
                        search.createColumn({name: 'custrecord_efx_db_payment'}),
                        search.createColumn({name: 'custrecord_efx_db_processed'}),
                        search.createColumn({name: 'custrecord_efx_db_pago'}),
                        search.createColumn({name: 'custrecord_efx_db_reference'}),
                        search.createColumn({name: 'custrecord_efx_db_abono'}),
                        search.createColumn({name: 'custrecord_cb_bank_code_text'}),
                        search.createColumn({name: 'custrecord_efx_fecha_pago'})
                    ]
                });
                try{
                    var countResults = busqueda_lineas.runPaged({
                        pageSize: 100
                    }).count;
                    log.debug({title: 'getInputData - Results ', details: countResults});
                    return busqueda_lineas;
                }
                catch (e) {
                    log.error({title: '001Error ', details: e});
                }


            } catch (e) {
                log.debug({title: '80Error ', details: e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic: true});
                logsys3.setValue({fieldId: 'custrecord_tkio_origen_log', value: 1});
                logsys3.setValue({fieldId: 'custrecord_tkio_txt_largo', value: e.message});
                logsys3.setValue({fieldId: 'custrecord_tkio_fecha_log', value: datelog});
                logsys3.save();
                updateRecord("customrecord_efx_db_txt_banco", custscript_efx_db_id_detail, {"custrecord_efx_db_processing": "F"});
            }


        }

        const map = (mapContext) => {
            log.debug({title: 'map - mapContext', details: mapContext});
            var idTxt = 0;
            var iddetail = 0;
            try {

                var recordValue = JSON.parse(mapContext.value);
                var value = recordValue.values;
                iddetail = mapContext.key;
                idTxt = value.custrecord_efx_db_tb.value;
                var codetext = value.custrecord_cb_bank_code_text;

                var custrecord_efx_db_reference = value.custrecord_efx_db_reference;
                var referenceItem = true;
                var iscolegiatura = (custrecord_efx_db_reference.indexOf('C') != -1)? 'T': 'F';

                if(iscolegiatura == 'F'){
                    var itemReference = getOtherReferenceData(custrecord_efx_db_reference, iddetail);
                    referenceItem = (itemReference)? true: false;
                }

                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_notes": ""});

                var customerDat = getCustomer(value.custrecord_efx_db_reference, iddetail, idTxt);
                var codeData = getCodes(codetext, iddetail, idTxt);

                if(customerDat == 1 && codeData == 1 && referenceItem == true){
                    var lookupDetail = search.lookupFields({
                        type: recordValue.recordType,
                        id: recordValue.id,
                        columns: [
                            'custrecord_efx_db_tb',
                            'custrecord_efx_db_line',
                            'custrecord_efx_db_payment',
                            'custrecord_efx_db_processed',
                            'custrecord_efx_db_pago',
                            'custrecord_efx_db_reference',
                            'custrecord_efx_db_abono',
                            'custrecord_efx_db_parent',
                          	'custrecord_efx_db_parent.custentity_efx_fe_usocfdi',
                          	'custrecord_efx_fe_usocfdi',
                            'custrecord_efx_fecha_pago',
                            'custrecord_efx_db_student',
                            'custrecord_efx_db_reference_item',
                            'custrecord_efx_cb_method_payment_sat',
                            'custrecord_efx_db_student.subsidiary',
                            'custrecord_efx_db_student.custentity_efx_ip_campus',
                            'custrecord_efx_db_student.custentity_efx_ip_rvoealumno',
                        ]
                    });

                    var date = lookupDetail['custrecord_efx_fecha_pago'];

                    var configRecObj = config.load({
                        type: config.Type.USER_PREFERENCES
                    });
                    var dateFormat = configRecObj.getValue({
                        fieldId: 'DATEFORMAT'
                    });

                    log.debug({title: 'map  dateFormat', details: dateFormat});

                    var mydateobject = moment(date, dateFormat).toDate();
                    log.debug({title: 'map  mydateobject', details: mydateobject});

                    lookupDetail['custrecord_efx_fecha_pago'] = (mydateobject.getMonth() + 1) +"/"+ mydateobject.getDate() +"/" + mydateobject.getFullYear();
                    var datedata = date.split("/");
                    var depositmonth = datedata[0];

                    lookupDetail['is_colegiatura'] = iscolegiatura;

                    var ppdata = getPPData(depositmonth);
                    lookupDetail['pp_date'] = ppdata.date;
                    lookupDetail['pp_percent'] = ppdata.percent;
                    lookupDetail['pp_item'] = 4439; //TODO parametro

                    var positivebalance = getPositiveBalanceInfo(lookupDetail.custrecord_efx_db_parent[0].value, lookupDetail.custrecord_efx_db_student[0].value);

                    lookupDetail['id_balance'] = positivebalance.id;
                    lookupDetail['amount_balance'] = positivebalance.amount; //TODO parametro
                    log.debug({title: 'map lookupDetail', details: lookupDetail});
                  
                  	if(lookupDetail['custrecord_efx_db_parent.custentity_efx_fe_usocfdi'].length){
                      	mapContext.write({
                            key: recordValue.id,
                            value: lookupDetail
                        });
                    }
                  else{
                    updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_notes": "El cliente no tiene configurado su uso de CFDI."});
                  }

                    

                }
            } catch (e) {
                    log.error({title: '108Error ', details: e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic: true});
                logsys3.setValue({fieldId: 'custrecord_tkio_origen_log', value: 1});
                logsys3.setValue({fieldId: 'custrecord_tkio_txt_largo', value: e.message});
                logsys3.setValue({fieldId: 'custrecord_tkio_fecha_log', value: datelog});
                logsys3.save();
                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_processed": "F", "custrecord_efx_db_notes": "No ha sido posible obtener el alumno mediante la referencia."});
                updateRecord("customrecord_efx_db_txt_banco", idTxt, {"custrecord_efx_db_processing": "F"});
            }

        }

        const reduce = (reduceContext) => {
            var iddetail = 0;
            try {
                log.debug({title: 'reduce - reduceContext', details: reduceContext});

                var recordValue = JSON.parse(reduceContext.values[0]);

                var student = recordValue['custrecord_efx_db_student'][0].value;
                var parent = recordValue['custrecord_efx_db_parent'][0].value;
                var subsidiary = recordValue['custrecord_efx_db_student.subsidiary'][0].value;
                var idcampus = recordValue['custrecord_efx_db_student.custentity_efx_ip_campus'][0].value;
                var paymentmethod = recordValue['custrecord_efx_cb_method_payment_sat'][0].value;
                var reference = recordValue['custrecord_efx_db_reference'];
                var referenceitem = (recordValue['custrecord_efx_db_reference_item'].length)?recordValue['custrecord_efx_db_reference_item'][0].value: 0;

                var date = recordValue['custrecord_efx_fecha_pago'];
                var datedata = date.split("/");
                var depositday = datedata[1];
                var depositmonth = datedata[0];
                var deposityear = datedata[2];

                var rvoe = recordValue['custrecord_efx_db_student.custentity_efx_ip_rvoealumno'];
                var depositamount = parseFloat(recordValue['custrecord_efx_db_pago']);
                var idbalance = recordValue['id_balance']*1;
                var amountbalance = parseFloat(recordValue['amount_balance']);
                var is_colegiatura = recordValue['is_colegiatura'];
                var studentsubsidiary = recordValue['custrecord_efx_db_student.subsidiary'][0].value;

                var studentidcampus = recordValue['custrecord_efx_db_student.custentity_efx_ip_campus'][0].value;
                var studentrvoe = (recordValue['custrecord_efx_db_student.custentity_efx_ip_rvoealumno'].length)?recordValue['custrecord_efx_db_student.custentity_efx_ip_rvoealumno'][0].value:'';
                var ppdate = recordValue['pp_date'];

                var pppercent = recordValue['pp_percent'];
                var ppitem = recordValue['pp_item'];
                var idTXT = recordValue['custrecord_efx_db_tb'][0].value;

                iddetail = reduceContext.key;
                var openinvoices = getOpenInvoices(reference);

                var typerfc = recordValue['custrecord_efx_db_parent.custentity_efx_fe_usocfdi'][0].value;

                if(is_colegiatura == 'T'){

                    var recharges = getRecharge(student);
                    //var balance = getPositiveBalance(student, parent);

                    var totalremaning = recharges.total + openinvoices.total;

                    var scenario = '';
                    var auxdeposit = depositamount;
                    auxdeposit += (amountbalance)? amountbalance: 0;

                    openinvoices.totalpayments = 0;
                    openinvoices.monthstr = "";
                    recharges.totalpayments = 0;
                    recharges.monthstr = "";

                    var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                    var paymentid = 0;

                    log.debug({title: 'reduce - auxdeposit', details: auxdeposit});
                    if(auxdeposit >= 6) {

                        //Recharges
                        for (var i in recharges.recharges) {
                            var recharge = recharges.recharges[i];
                            var amount = recharge.amount;

                            var difference = amount - auxdeposit;

                            if (difference == 0 && i == 0) {
                                recharges.recharges[i].paymentamount = auxdeposit;
                            } else if (difference == 0 || difference > 0) {
                                recharges.recharges[i].paymentamount = auxdeposit;
                            } else if (difference < 0) {
                                recharges.recharges[i].paymentamount = amount;
                            }
                            recharges.totalpayments += recharges.recharges[i].paymentamount * 1;
                            auxdeposit -= amount;


                            recharges.recharges[i].monthstr = ' ' + months[parseFloat(recharges.recharges[i].month) - 1] + " " + recharges.recharges[i].year;

                            if (auxdeposit <= 0) {
                                break;
                            }

                        }
                        var firstid = 0;

                        //Invoices
                        for (var i in openinvoices.invoices) {
                            var invoice = openinvoices.invoices[i];
                            var amount = invoice.amountremaining;

                            var difference = amount - auxdeposit;

                            if (!firstid) {
                                firstid = openinvoices.invoices[i].internalid;
                            }
                            if (difference == 0 && i == 0) {
                                openinvoices.invoices[i].paymentamount = auxdeposit;
                            } else if (difference == 0 || difference > 0) {
                                openinvoices.invoices[i].paymentamount = auxdeposit;
                            } else if (difference < 0) {
                                openinvoices.invoices[i].paymentamount = amount;
                            }
                            openinvoices.totalpayments += openinvoices.invoices[i].paymentamount * 1;
                            auxdeposit -= amount;
                            typerfc = openinvoices.invoices[i].rfc_type;


                            openinvoices.monthstr += (openinvoices.monthstr) ? ', ' : ' ';
                            openinvoices.monthstr += months[parseFloat(openinvoices.invoices[i].month) - 1] + " " + openinvoices.invoices[i].year;

                            if (auxdeposit <= 0) {
                                break;
                            }

                        }

                        //Pronto pago
                        if(openinvoices.totalpayments >= openinvoices.total){
                            if(depositday <= ppdate){
                                applyProntoPago(openinvoices, ppdate, pppercent, ppitem);
                            }
                        }



                        log.debug({title: 'reduce - recharges', details: recharges});
                        log.debug({title: 'reduce - openinvoices', details: openinvoices});

                        var totaltoapply = openinvoices.totalpayments + recharges.totalpayments;
                        var opendescription = openinvoices.monthstr;
                        var rechargesdescription = recharges.monthstr;

                        var just_recharges = (openinvoices.totalpayments == 0) ? 'T' : 'F';

                        var invoiceid = 0;
                        var justoneinvoice = false;

                        if(openinvoices.invoices.length == 1 &&
                            openinvoices.totalpayments == openinvoices.total &&
                            openinvoices.totalpayments == depositamount){ //Pago justo
                            justoneinvoice = true;
                            invoiceid = openinvoices.invoices[0].internalid;
                        }
                        else{
                            log.debug({title: 'reduce - depositamount', details: depositamount}); //Factura y pago
                            invoiceid = createDeposit(parent, student, subsidiary, idcampus, reference, date, paymentmethod, typerfc, depositamount, just_recharges, recharges.recharges, recharges.totalpayments, rvoe, opendescription, rechargesdescription);
                        }


                        if(invoiceid) {
                            log.debug({title: 'reduce - totalapply', details: totaltoapply}); //Pago para aplicar

                            paymentid = createApplyPayment(firstid, parent, student, subsidiary, idcampus, reference, date, paymentmethod, typerfc, rvoe, openinvoices.totalpayments , openinvoices.invoices, justoneinvoice);
                            paymentid = (paymentid)? paymentid: "";
                            if (paymentid || openinvoices.totalpayments <= 0) {
                                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {
                                    "custrecord_efx_db_invoice": invoiceid,
                                    "custrecord_efx_db_payment": paymentid,
                                    "custrecord_efx_db_processed": 'T',
                                    "custrecord_efx_db_notes": ""
                                });



                                //UPDATE BALANCE
                                //DISCOUNT BALANCE AMOUNT
                                var amountdiscount = 0;
                                if (amountbalance > 0) {
                                    amountdiscount = (amountbalance > totaltoapply) ? (amountbalance - totaltoapply) : 0;
                                    log.debug({title: 'reduce - amountdiscountbalance', details: amountdiscount});
                                    updateBalance(amountdiscount, idbalance, parent, student);
                                }

                                //ADD BALANCE AMOUNT
                                if (totaltoapply < (depositamount + amountbalance)) {//Saldo a favor
                                    var differencestobalance = (depositamount + amountbalance) - totaltoapply;
                                    differencestobalance += amountdiscount;
                                    log.debug({title: 'reduce - differencestobalance', details: differencestobalance});
                                    updateBalance(differencestobalance, idbalance, parent, student);
                                }

                                //APPLY RECHARGES
                                if(recharges.recharges.length){
                                    applyRecharges(recharges, parent, student, idcampus, reference, rvoe);
                                }
                            }
                        }
                        else if(openinvoices.total == 0 && recharges.total == 0 ){
                                	//ANDY
                             var positiveBalance = depositamount + amountbalance;
                                    log.debug({title: 'reduce - positiveBalance', details: positiveBalance});
                                    updateBalance(positiveBalance, idbalance, parent, student);
                      
                                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {
                                    "custrecord_efx_db_notes": "No se encontraron facturas abiertas o recargos pendientes, se ha abonado $" +depositamount +" quedando $"+positiveBalance+" de saldo a favor." ,
                                    "custrecord_efx_db_processed": 'T'
                                });
						}
                    }
                }
                else {
                    invoiceid = createDepositOtherReference (parent, student, subsidiary, idcampus, reference, date, paymentmethod, typerfc, depositamount, rvoe, referenceitem, iddetail);
                }

                var slurl = urlMod.resolveScript({
                    scriptId: 'customscript_efx_fe_cfdi_sl',
                    deploymentId: 'customdeploy_efx_fe_cfdi_sl',
                    returnExternalUrl: true,
                    params: {
                        custparam_tranid: invoiceid,
                        custparam_trantype: record.Type.INVOICE,
                        custparam_pa: 'T',
                        custparam_response: 'T',
                    }
                });
                log.debug({title: 'reduce URL', details: JSON.stringify(slurl)});

                var header = {
                    "content-type": 'application/JSON'
                }
                var response = https.get({
                    headers: header,
                    // url: slurl
                    url: slurl
                });

                log.audit({title: 'reduce timbrado response ', details: response});

                var responsecode = response.code || '';
                var responsebody = response.body || '';



            } catch (e) {
                log.error({title: '256Error ', details: e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic: true});
                logsys3.setValue({fieldId: 'custrecord_tkio_origen_log', value: 1});
                logsys3.setValue({fieldId: 'custrecord_tkio_txt_largo', value: e.message});
                logsys3.setValue({fieldId: 'custrecord_tkio_fecha_log', value: datelog});
                logsys3.save();

                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_processed": 'F', "custrecord_efx_db_notes": "No ha sido posible procesar los pagos."});
            }

        }

        const createDepositOtherReference = (parent, student, subsidiary, idcampus, reference, datedata, paymentmethod, typerfc, amount, rvoe, itemreference, iddetail) => { //TODO: SOLO CONCEPTO OTROS (ASI SE LLAMA EL ARTICULO) SOLO DESGLOSA IVA.
            try{
                log.debug({title: 'createDepositOtherReference date', details:datedata});
                log.debug({title: 'createDepositOtherReference amount', details:amount});
                log.debug({title: 'createDepositOtherReference idcampus', details:idcampus});
                datedata = datedata.split("/");
                var date = new Date();
                date.setDate(datedata[1]);
                date.setMonth(datedata[0] - 1);
                date.setFullYear(datedata[2]);
                //Factura
                var invoPagoCompleto = record.create({type: record.Type.INVOICE, isDynamic:true});
                invoPagoCompleto.setValue({fieldId:'entity',value: parent});
                invoPagoCompleto.setValue({fieldId:'subsidiary',value: subsidiary });
                invoPagoCompleto.setValue({fieldId:'location',value: idcampus });
                invoPagoCompleto.setValue({fieldId:'approvalstatus',value: 2 });
                invoPagoCompleto.setValue({fieldId:'custbody_efx_alumno',value: student });
                invoPagoCompleto.setValue({fieldId:'custbody_ref_banc',value: reference });
                invoPagoCompleto.setValue({fieldId:'custbody_efx_ip_tid',value: student });
                invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_formapago',value: "20" });
                invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_metodopago',value: '2' });
                invoPagoCompleto.setValue({fieldId:'trandate',value: date });

                if(paymentmethod)
                    invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_formapago',value: paymentmethod })

                invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_metodopago',value: 1 })
                invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_complemento_educativo',value: true })

                if(typerfc)
                    invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_usocfdi',value: typerfc })

                //var rfctype = geTypeRFC(fac_rfc);
                invoPagoCompleto.selectNewLine({sublistId : 'item'});

                //Artículo de referencia

                invoPagoCompleto.setCurrentSublistValue({
                    sublistId : 'item',
                    fieldId   : 'item',
                    value     : itemreference
                });
                invoPagoCompleto.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_efx_ip_idchild',
                    value: student,
                });


                if(rvoe){
                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_efx_fe_com_edu_clave_autrvoe',
                        value: rvoe,
                    });
                }

                invoPagoCompleto.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: (amount/ 1.16),
                    ignoreFieldChange: false});
                invoPagoCompleto.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount',
                    value: (amount/ 1.16),
                    ignoreFieldChange: false});

                invoPagoCompleto.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_efx_ip_idchild',
                    value: student,
                });
                invoPagoCompleto.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_efx_ip_childprospectus',
                    value: student,
                });


                invoPagoCompleto.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'taxcode',
                    value: 24,
                    ignoreFieldChange: false
                });
                invoPagoCompleto.commitLine({sublistId : 'item'});

                invoPagoCompleto.selectNewLine({sublistId : 'item'});
                invoPagoCompleto.setCurrentSublistValue({
                    sublistId : 'item',
                    fieldId   : 'item',
                    value     : '-2'
                });
                invoPagoCompleto.commitLine({sublistId : 'item'});

                var invoiceid = invoPagoCompleto.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

                log.debug({title: 'createDeposit invoiceid', details:invoiceid});
                //Pago

                var TranformPagoCompleto = record.transform({
                    fromType: record.Type.INVOICE,
                    fromId: invoiceid,
                    toType: record.Type.CUSTOMER_PAYMENT,
                    isDynamic: true,
                });
                TranformPagoCompleto.setValue({
                    fieldId: 'amount',
                    value: amount
                });
                if(idcampus!= 9){
                    TranformPagoCompleto.setValue({
                        fieldId: 'account',
                        value: 720 //TODO parametro
                    });
                }else{
                    TranformPagoCompleto.setValue({
                        fieldId: 'undepfunds',
                        value: 'T'
                    });
                }
                TranformPagoCompleto.setValue({
                    fieldId: 'location',
                    value: idcampus
                });
                TranformPagoCompleto.setValue({
                    fieldId: 'custbody_efx_alumno',
                    value: student
                });
                TranformPagoCompleto.setValue({
                    fieldId: 'trandate',
                    value: date
                });
                var paymentid = TranformPagoCompleto.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

                log.debug({title: 'createDeposit paymentid', details:paymentid});


                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {
                    "custrecord_efx_db_invoice": invoiceid,
                    "custrecord_efx_db_payment": paymentid,
                    "custrecord_efx_db_processed": 'T',
                    "custrecord_efx_db_notes": ""
                });
                return invoiceid;
            }catch (e) {
                log.error({title: '1920Error ', details:e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic:true});
                logsys3.setValue({fieldId:'custrecord_tkio_origen_log',value: 1});
                logsys3.setValue({fieldId:'custrecord_tkio_txt_largo',value: e.message});
                logsys3.setValue({fieldId:'custrecord_tkio_fecha_log',value: datelog });
                logsys3.save();
                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {
                    "custrecord_efx_db_invoice": "",
                    "custrecord_efx_db_payment": "",
                    "custrecord_efx_db_processed": 'F',
                    "custrecord_efx_db_notes": "No ha sido posible generar el pago, revise los logs de sistema."
                });
                return null;
            }
        }

        const getOtherReferenceData = (reference, iddetail) => {
            try{
                log.debug({title: 'getOtherReferenceData reference ', details: reference});
                log.debug({title: 'getOtherReferenceData iddetail ', details: iddetail});
                var customrecord_efx_db_txt_referenciaSearchObj = search.create({
                    type: "customrecord_efx_db_txt_referencia",
                    filters:
                        [
                            ["custrecord_efx_db_ref_ref","contains",reference]
                        ],
                    columns:
                        [
                            search.createColumn({name: "custrecord_efx_db_ref_ref", label: "Referencia"}),
                            search.createColumn({name: "custrecord_efx_db_ref_customer", label: "Alumno"}),
                            search.createColumn({name: "custrecord_efx_db_ref_item", label: "Articulo"})
                        ]
                });
                var results = customrecord_efx_db_txt_referenciaSearchObj.run().getRange({ start: 0, end: 1000 });
              log.debug({title: 'getOtherReferenceData results ', details: results});
                if(results.length){
                    var item = results[0].getValue({name: "custrecord_efx_db_ref_item", label: "Articulo"});
                    updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_reference_item": item});
                    log.debug({title: 'getOtherReferenceData item ', details: item});
                    return item;
                }
                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_notes": "No ha sido posible encontrar el artículo de la referencia.", "custrecord_efx_db_reference_item": ""});
                return null;
            }
            catch (e) {
                log.error({title: '253Error ', details: e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic: true});
                logsys3.setValue({fieldId: 'custrecord_tkio_origen_log', value: 1});
                logsys3.setValue({fieldId: 'custrecord_tkio_txt_largo', value: e.message});
                logsys3.setValue({fieldId: 'custrecord_tkio_fecha_log', value: datelog});
                logsys3.save();
                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_notes": "No ha sido posible encontrar el artículo de la referencia."});
                return null;
            }
        }

        const applyRecharges = (recharges, parent, student, idcampus, reference, rvoe) => {
            try{
                for(var i in recharges.recharges){
                    recharge = recharges.recharges[i];

                    var newamount = recharge.amount*1 - recharge.paymentamount;
                    updateRecord("customrecord_tkio_registro_recargo", recharge.id, {
                        "custrecord_tkio_cantidad_recargos": (newamount <= 0)? 0 : newamount
                    });

                }
                return true;
            }
            catch (e) {
                log.error({title: '249Error ', details: e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic: true});
                logsys3.setValue({fieldId: 'custrecord_tkio_origen_log', value: 1});
                logsys3.setValue({fieldId: 'custrecord_tkio_txt_largo', value: e.message});
                logsys3.setValue({fieldId: 'custrecord_tkio_fecha_log', value: datelog});
                logsys3.save();
                return false;
            }
        }

        const applyProntoPago = (openinvoices, ppdate, pppercent, ppitem) =>{
            try{
                var invoice = openinvoices.invoices[openinvoices.invoices.length - 1];
                var discount = (invoice.amount * (pppercent/100))*(-1);
                log.debug({title: 'applyProntoPago - invoice ', details: invoice});
                log.debug({title: 'applyProntoPago - invoice.amount ', details: invoice.amount});
                log.debug({title: 'applyProntoPago - openinvoices.total ', details: openinvoices.total});
                log.debug({title: 'applyProntoPago - invoice.internalid ', details: invoice.internalid});
                var invoiceRecord = record.load({
                    type: record.Type.INVOICE,
                    id: invoice.internalid,
                    isDynamic: true
                });

                invoiceRecord.selectNewLine({sublistId: 'item'});


                invoiceRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: ppitem
                });
                invoiceRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: discount
                });
                invoiceRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'description',
                    value: 'Prontopago por valor de: '+ pppercent + "%"
                });

                invoiceRecord.commitLine('item');
                invoiceRecord.selectNewLine({sublistId : 'item'});
                invoiceRecord.setCurrentSublistValue({
                    sublistId : 'item',
                    fieldId   : 'item',
                    value     : '-2'
                });
                invoiceRecord.commitLine({sublistId : 'item'});
                var idinvoice = invoiceRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });


                invoice.amount += discount;
                invoice.amountremaining += discount;
                invoice.paymentamount += discount;
                openinvoices.totalpayments += discount;
                openinvoices.total += discount;
                log.debug({title: 'applyProntoPago - discount ', details: discount});
                log.debug({title: 'applyProntoPago - invoice.amount ', details: invoice.amount});
                log.debug({title: 'applyProntoPago - openinvoices.total ', details: openinvoices.total});

                return openinvoices;


            }
            catch (e) {
                log.error({title: '250Error ', details: e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic: true});
                logsys3.setValue({fieldId: 'custrecord_tkio_origen_log', value: 1});
                logsys3.setValue({fieldId: 'custrecord_tkio_txt_largo', value: e.message});
                logsys3.setValue({fieldId: 'custrecord_tkio_fecha_log', value: datelog});
                logsys3.save();
            }
        }

        const updateBalance = (amount, id, parent, student) => {
            try {
                var idbalance = 0;
                log.error({title: 'updateBalance id', details: id});
                log.error({title: 'updateBalance amount', details: amount});
                var roundedamount =(Math.round(amount * 100)/100);
                log.error({title: 'updateBalance  roundedamount', details: roundedamount});
                if(!id){
                    var balanceRecord = record.create({
                        type: 'customrecord_tkio_saldo_afavor_padre',
                        isDynamic: true
                    });
                    balanceRecord.setValue({
                        fieldId: 'custrecord_tkio_saldo_padre_monto',
                        value: roundedamount,
                        ignoreFieldChange: true
                    });
                    balanceRecord.setValue({
                        fieldId: 'custrecord_tkio_saldo_afavor_clitneteid',
                        value: parent,
                        ignoreFieldChange: false
                    });
                    balanceRecord.setValue({
                        fieldId: 'custrecord_tkio_saldo_hijoid',
                        value: student,
                        ignoreFieldChange: true
                    });
                    idbalance = balanceRecord.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                }
                else {
                    idbalance = record.submitFields({
                        type: "customrecord_tkio_saldo_afavor_padre",
                        id: id,
                        values: {
                            "custrecord_tkio_saldo_padre_monto": roundedamount
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields : true
                        }
                    });
                }

                log.debug({title: 'idbalance ', details: idbalance});
                return idbalance;
            }
            catch (e) {
                log.error({title: '254Error ', details: e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic: true});
                logsys3.setValue({fieldId: 'custrecord_tkio_origen_log', value: 1});
                logsys3.setValue({fieldId: 'custrecord_tkio_txt_largo', value: e.message});
                logsys3.setValue({fieldId: 'custrecord_tkio_fecha_log', value: datelog});
                logsys3.save();

                return null;
            }
        }

        const  createApplyPayment = (firstid, parent, student, subsidiary, idcampus, reference, datedata, paymentmethod, typerfc, rvoe, totalpayment, invoices, justoneinvoice) => {
                try{
                    log.debug({title: 'createApplyPayment invoices ', details: invoices});
                    log.debug({title: 'createApplyPayment idcampus ', details: idcampus});
                    log.debug({title: 'createApplyPayment justoneinvoice ', details: justoneinvoice});
                    var datedata = datedata.split("/");
                    var date = new Date();
                    date.setDate(datedata[1]);
                    date.setMonth(datedata[0] - 1);
                    date.setFullYear(datedata[2]);

                    var TranformPagoCompleto = record.transform({
                        fromType: record.Type.INVOICE,
                        fromId: firstid,
                        toType: record.Type.CUSTOMER_PAYMENT,
                        isDynamic: true,
                    });
                    TranformPagoCompleto.setValue({
                        fieldId: 'amount',
                        value: totalpayment
                    });
                  	TranformPagoCompleto.setValue({
                        fieldId: 'custbody_efx_fe_usocfdi',
                        value: typerfc
                    });
                    TranformPagoCompleto.setValue({
                        fieldId: 'payment',
                        value: totalpayment
                    });

                    if(justoneinvoice){
                        if(idcampus != 9){
                            TranformPagoCompleto.setValue({
                                fieldId: 'account',
                                value: 720//TODO parametro
                            });
                        }
                        else{
                            TranformPagoCompleto.setValue({
                                fieldId: 'undepfunds',
                                value: 'T'
                            });
                        }
                    }
                    else {
                        TranformPagoCompleto.setValue({
                            fieldId: 'account',
                            value: 1267 //TODO parametro
                        });
                    }

                    /*TranformPagoCompleto.setValue({
                        fieldId: 'account',
                        value: (justoneinvoice)? (idcampus != 9)? 720: andy: 1267 //TODO parametro
                    });*/

                    TranformPagoCompleto.setValue({
                        fieldId: 'custbody_efx_alumno',
                        value: student
                    });

                    TranformPagoCompleto.setValue({
                        fieldId: 'location',
                        value: idcampus
                    });
                    TranformPagoCompleto.setValue({
                        fieldId: 'custbody_efx_alumno',
                        value: student
                    });
                    TranformPagoCompleto.setValue({
                        fieldId: 'trandate',
                        value: date
                    });

                    var numLinepay = TranformPagoCompleto.getLineCount({sublistId: 'apply'});

                    for (var j = 0; j < numLinepay; j++){
                        var invoiceid = TranformPagoCompleto.getSublistValue({
                            sublistId: 'apply',
                            fieldId: 'internalid',
                            line: j
                        });


                        for(var x in invoices){

                            if(invoiceid == invoices[x].internalid){
                                log.debug({title: 'createApplyPayment invoiceid', details: invoiceid});
                                log.debug({title: 'createApplyPayment invoices['+x+']', details: invoices[x]});
                                if(!(invoices[x].paymentamount && invoices[x].paymentamount > 0)){
                                    continue;
                                }
                                TranformPagoCompleto.selectLine({
                                    sublistId: 'apply',
                                    line: j
                                });
                                TranformPagoCompleto.setCurrentSublistValue({
                                    sublistId: 'apply',
                                    fieldId: 'apply',
                                    line:j ,
                                    value: true
                                });
                                TranformPagoCompleto.setCurrentSublistValue({
                                    sublistId: 'apply',
                                    fieldId: 'amount',
                                    line:j ,
                                    value: invoices[x].paymentamount
                                });
                                TranformPagoCompleto.commitLine({
                                    sublistId: 'apply'
                                });
                                continue;
                            }
                        }
                    }

                    var paymentid = TranformPagoCompleto.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                    log.debug({title: 'createApplyPayment paymentid', details: paymentid});

                    return paymentid;


                }
                catch (e) {
                    log.error({title: '276Error ', details: e});
                    var datelog = new Date();
                    var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic: true});
                    logsys3.setValue({fieldId: 'custrecord_tkio_origen_log', value: 1});
                    logsys3.setValue({fieldId: 'custrecord_tkio_txt_largo', value: e.message});
                    logsys3.setValue({fieldId: 'custrecord_tkio_fecha_log', value: datelog});
                    logsys3.save();
                    return null;
                }
        }

        const createDeposit = (parent, student, subsidiary, idcampus, reference, datedata, paymentmethod, typerfc, openamount, just_rechages, recharges, rechargeamount, rvoe, opendescription, rechargesdescription) => {
            try{
                log.debug({title: 'createDeposit date', details:datedata});
                log.debug({title: 'createDeposit just_rechages', details:just_rechages});
                log.debug({title: 'createDeposit openamount', details:openamount});
                datedata = datedata.split("/");
                var date = new Date();
                date.setDate(datedata[1]);
                date.setMonth(datedata[0] - 1);
                date.setFullYear(datedata[2]);
                //Factura
                var invoPagoCompleto = record.create({type: record.Type.INVOICE, isDynamic:true});
                invoPagoCompleto.setValue({fieldId:'entity',value: parent});
                invoPagoCompleto.setValue({fieldId:'subsidiary',value: subsidiary });
                invoPagoCompleto.setValue({fieldId:'location',value: idcampus });
                invoPagoCompleto.setValue({fieldId:'approvalstatus',value: 2 });
                invoPagoCompleto.setValue({fieldId:'custbody_efx_alumno',value: student })
                invoPagoCompleto.setValue({fieldId:'custbody_ref_banc',value: reference })
                invoPagoCompleto.setValue({fieldId:'custbody_efx_ip_tid',value: student })
                invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_formapago',value: '20' })
                invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_metodopago',value: '2' })
                invoPagoCompleto.setValue({fieldId:'trandate',value: date })

                if(paymentmethod)
                invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_formapago',value: paymentmethod })

                invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_metodopago',value: 1 })
                invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_complemento_educativo',value: true })
                invoPagoCompleto.setValue({fieldId:'custbody_efx_fe_usocfdi',value: typerfc })
                invoPagoCompleto.selectNewLine({sublistId : 'item'});

                //Artículo colegiatura
                if(just_rechages == 'F' && openamount > rechargeamount){
                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId : 'item',
                        fieldId   : 'item',
                        value     : 589 //TODO parametero
                    });
                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_efx_ip_idchild',
                        value: student,
                    });


                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'description',
                        value: 'Colegiatura correspondiente a los meses de:' + opendescription
                    });
                    if(rvoe){
                        invoPagoCompleto.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_efx_fe_com_edu_clave_autrvoe',
                            value: rvoe,
                        });
                    }
                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_efx_ip_idchild',
                        value: student,
                    });
                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_efx_ip_childprospectus',
                        value: student,
                    });
                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'amount',
                        value: (openamount -rechargeamount)});
                    invoPagoCompleto.commitLine({sublistId : 'item'});
                }

                //Artículo recargos
                for(var i = 0 ; i< recharges.length; i ++ ){
                    if(!(recharges[i].paymentamount && recharges[i].paymentamount > 0)){
                        continue;
                    }
                    var amountline = (recharges[i].paymentamount) / 1.16 ;
                    var monthtext = recharges[i].mestext;
                    var monthdata = monthtext.split("-");

                    invoPagoCompleto.selectNewLine({sublistId : 'item'});
                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId : 'item',
                        fieldId   : 'item',
                        value     : 173
                    });

                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'amount',
                        value:  amountline ,
                    });


                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'description',
                        value: 'Recargo correspondiente al mes de:  '+recharges[i].monthstr //monthdata[1]
                    });

                    if(rvoe){
                        invoPagoCompleto.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_efx_fe_com_edu_clave_autrvoe',
                            value: rvoe,
                        });
                    }
                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_efx_ip_idchild',
                        value: student,
                    });

                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_efx_ip_childprospectus',
                        value: student,
                    });
                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'taxcode',
                        value: '24' ,//TODO parameter
                    });


                    invoPagoCompleto.commitLine({sublistId : 'item'});
                    invoPagoCompleto.selectNewLine({sublistId : 'item'});
                    invoPagoCompleto.setCurrentSublistValue({
                        sublistId : 'item',
                        fieldId   : 'item',
                        value     : '-2'
                    });
                    invoPagoCompleto.commitLine({sublistId : 'item'});
                }





                var invoiceid = invoPagoCompleto.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

                log.debug({title: 'createDeposit invoiceid', details:invoiceid});
                //Pago

                var TranformPagoCompleto = record.transform({
                    fromType: record.Type.INVOICE,
                    fromId: invoiceid,
                    toType: record.Type.CUSTOMER_PAYMENT,
                    isDynamic: true,
                });
                TranformPagoCompleto.setValue({
                    fieldId: 'amount',
                    value: (openamount + rechargeamount)
                });
                if(idcampus!= 9){
                    TranformPagoCompleto.setValue({
                        fieldId: 'account',
                        value: 720 //TODO parametro
                    });
                }else{
                    TranformPagoCompleto.setValue({
                        fieldId: 'undepfunds',
                        value: 'T'
                    });
                }
                TranformPagoCompleto.setValue({
                    fieldId: 'location',
                    value: idcampus
                });
                TranformPagoCompleto.setValue({
                    fieldId: 'custbody_efx_alumno',
                    value: student
                });
                TranformPagoCompleto.setValue({
                    fieldId: 'trandate',
                    value: date
                });
                var paymentid = TranformPagoCompleto.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

                log.debug({title: 'createDeposit paymentid', details:paymentid});

                return invoiceid;
            }catch (e) {
                log.error({title: '1920Error ', details:e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic:true});
                logsys3.setValue({fieldId:'custrecord_tkio_origen_log',value: 1});
                logsys3.setValue({fieldId:'custrecord_tkio_txt_largo',value: e.message});
                logsys3.setValue({fieldId:'custrecord_tkio_fecha_log',value: datelog });
                logsys3.save();
                return null;
            }
        }

        const getCodes = (text, iddetail, idTxt) => {
            try{
                var customrecord_db_bank_codeSearchObj = search.create({
                    type: "customrecord_db_bank_code",
                    filters:
                        [
                            [
                                ["name","contains",text],
                                "OR",
                                ["name","is",'DEFAULT']
                            ],
                            "AND",
                            ["isinactive", "is", 'F']
                        ],
                    columns:
                        [
                            search.createColumn({ name: "name",  sort: search.Sort.ASC }),
                            search.createColumn({name: "scriptid", label: "Script ID"}),
                            search.createColumn({name: "custrecord_cb_payment_sat", label: "Forma de pago SAT"}),
                        ]
                });
                var methoddata = {name: '', satpayment: ''};
                var methoddefault = {name: '', satpayment: ''};
                customrecord_db_bank_codeSearchObj.run().each(function(result){
                    var name = result.getValue({ name: "name",  sort: search.Sort.ASC });
                    var paysat = result.getValue({name: "custrecord_cb_payment_sat", label: "Forma de pago SAT"});

                    if(name == 'DEFAULT'){
                        methoddefault.id = result.id;
                        methoddefault.name = name;
                        methoddefault.satpayment = paysat;
                    }

                    if(name == text){
                        methoddata.id = result.id;
                        methoddata.name = name;
                        methoddata.satpayment = paysat;
                    }

                    return true;
                });

                if(methoddata.name){
                    log.debug({title: 'getCodes - methoddata', details: methoddata});
                    updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_cb_bank_code": methoddata.id, "custrecord_efx_cb_method_payment_sat": methoddata.satpayment, "custrecord_efx_db_processed": "F"});
                    return 1;
                }
                else{
                    log.debug({title: 'getCodes - methoddefault', details: "NO FOUND!"});
                    updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_cb_bank_code": "", "custrecord_efx_cb_method_payment_sat": "", "custrecord_efx_db_processed": "F", "custrecord_efx_db_notes": "No se ha encontrado un codigo bancario configurado para colocar Forma de Pago SAT." });
                    return -1;
                }

            }catch (e) {
                log.error({title: '107Error ', details: e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic: true});
                logsys3.setValue({fieldId: 'custrecord_tkio_origen_log', value: 1});
                logsys3.setValue({fieldId: 'custrecord_tkio_txt_largo', value: e.message});
                logsys3.setValue({fieldId: 'custrecord_tkio_fecha_log', value: datelog});
                logsys3.save();
                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_processed": "F", "custrecord_efx_db_notes": "No ha sido posible obtener el codigo bancario."});
                updateRecord("customrecord_efx_db_txt_banco", idTxt, {"custrecord_efx_db_processing": "F"});
                return 0;
            }
        }

        const getPPData = (month) => {
            try{
                var curr_month = new Date().getMonth() + 1;
                curr_month = month || curr_month.toString();
                if(curr_month.length == 1){
                    curr_month = '0'+curr_month;
                }

                if(curr_month == 13){
                    curr_month = '01'
                }
                log.debug({title: 'getPPData - curr_month ', details:curr_month});
                var customrecord_efx_pronto_pagoSearchObj = search.create({
                    type: "customrecord_efx_pronto_pago",
                    filters:
                        [
                            ["custrecord_efx_selec_mes.name","contains",curr_month]
                        ],
                    columns:
                        [

                            search.createColumn({name: 'custrecord_efx_pro_dias'}),
                            search.createColumn({name: "custrecord_efx_pro_porcentaje", label: "Porcentaje"}),

                        ]
                });
                var searchResultCount = customrecord_efx_pronto_pagoSearchObj.runPaged().count;
                log.debug({title: 'getPPData searchResultCount ', details:searchResultCount});
                var diaProntoPago;
                var porcpp;
                var dateResult = {};
                customrecord_efx_pronto_pagoSearchObj.run().each(function(result){
                    diaProntoPago = result.getValue({name: 'custrecord_efx_pro_dias'});
                    porcpp = result.getValue({name: 'custrecord_efx_pro_porcentaje'});
                    dateResult = {date :parseFloat(diaProntoPago), percent: parseFloat(porcpp.replace("%", "")) };
                    return true;
                });
                log.debug({title: 'getPPData dateResult ', details:dateResult});
                return dateResult;
            }catch (e) {
                log.debug({title: '481Error ', details:e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic:true});
                logsys3.setValue({fieldId:'custrecord_tkio_origen_log',value: 1});
                logsys3.setValue({fieldId:'custrecord_tkio_txt_largo',value: e.message});
                logsys3.setValue({fieldId:'custrecord_tkio_fecha_log',value: datelog });
                logsys3.save();
                return null;
            }

        }

        const getRecharge = (student) => {
            try {

                var objRecharge = {total:0, recharges: []};
                var customrecord_tkio_registro_recargoSearchObj = search.create({
                    type: "customrecord_tkio_registro_recargo",
                    filters:
                        [
                            ["custrecord_tkio_hijo_name", search.Operator.IS,student],
                            'AND',
                            ["custrecord_tkio_cantidad_recargos", search.Operator.ISNOT,'0'],
                            'AND',
                            ["custrecord_tkio_factura_origen.mainline", search.Operator.IS,'T']
                        ],
                    columns:
                        [
                            search.createColumn({name: "created", sort: search.Sort.ASC,  label: "Date Created" }),
                            search.createColumn({name: "custrecord_tkio_cantidad_recargos", label: "Monto"}),
                            search.createColumn({name: "custrecord_tkio_factura_origen", label: "Invoice"}),
                            search.createColumn({name: "trandate", join: "custrecord_tkio_factura_origen", label: "Invoice"}),
                            search.createColumn({name: "internalid", label: "ID interno"}),
                            search.createColumn({name: "custrecord_tkio_meses_recargo", label: "Meses"})
                        ]
                });
                var mesesGroup = [];
                var SumaMontoRecargos= 0;
                var idRecargo = [];
                var valorrecargo = [];

                var configRecObj = config.load({
                    type: config.Type.USER_PREFERENCES
                });
                var dateFormat = configRecObj.getValue({
                    fieldId: 'DATEFORMAT'
                });

                log.debug({title: 'getRecharge  dateFormat', details: dateFormat});




                customrecord_tkio_registro_recargoSearchObj.run().each(function(result){

                    objRecharge.total += parseFloat(result.getValue({name: "custrecord_tkio_cantidad_recargos"}));


                    var fac_date = result.getValue({name: "trandate", join: "custrecord_tkio_factura_origen", label: "Invoice"});
                    var mydateobject = moment(fac_date, dateFormat).toDate();
                    log.debug({title: 'getRecharge  mydateobject', details: mydateobject});

                    fac_date = (mydateobject.getMonth() + 1) +"/"+ mydateobject.getDate() +"/" + mydateobject.getFullYear();

                    objRecharge.recharges.push({
                        mesid: result.getValue({name: "custrecord_tkio_meses_recargo"}),
                        mestext: result.getText({name: "custrecord_tkio_meses_recargo"}),
                        id: result.getValue({name: "internalid"}),
                        amount: result.getValue({name: "custrecord_tkio_cantidad_recargos"}),
                        invoice: result.getValue({name: "custrecord_tkio_factura_origen", label: "Invoice"}),
                        trandate: fac_date,
                        month: (mydateobject.getMonth() + 1),
                        date: mydateobject.getDate(),
                        year: mydateobject.getFullYear()
                    });

                    /*SumaMontoRecargos = parseFloat(result.getValue({name: "custrecord_tkio_cantidad_recargos"})) + SumaMontoRecargos;
                    mesesGroup.push(result.getValue({name: "custrecord_tkio_meses_recargo"}));
                    idRecargo.push(result.getValue({name: "internalid"})) ;
                    valorrecargo.push(result.getValue({name: "custrecord_tkio_cantidad_recargos"}));*/
                    return true;
                });
                /*ObjRec.push({mesesGroup:mesesGroup,SumaMontoRecargos:SumaMontoRecargos,idRecargo:idRecargo,valorrecargo:valorrecargo})
                return ObjRec;*/
                log.debug({title: 'getRecharge -  objRecharge', details:objRecharge});
                return objRecharge
            }catch (e) {
                log.error({title: '636Error ', details:e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic:true});
                logsys3.setValue({fieldId:'custrecord_tkio_origen_log',value: 1});
                logsys3.setValue({fieldId:'custrecord_tkio_txt_largo',value: e.message});
                logsys3.setValue({fieldId:'custrecord_tkio_fecha_log',value: datelog });
                logsys3.save();
                return null;
            }
        }

        const getOpenInvoices = (reference) =>  {
            try {
                var busqueda_facturas = search.create({
                    type: search.Type.INVOICE,
                    filters: [
                        ['custbody_ref_banc', search.Operator.IS, reference ]
                        , 'and',
                        ['status', search.Operator.IS, 'CustInvc:A']
                        , 'and',
                        ['mainline', search.Operator.IS, 'T']
                        , 'and',
                        ['taxline', search.Operator.IS, 'F'],
                        "AND",
                        ["item", search.Operator.NONEOF, "173"],
                        "AND",
                        ["amount", search.Operator.GREATERTHANOREQUALTO, 5]//TODO parametro tolerancia
                    ],
                    columns: [

                        search.createColumn({name: 'custbody_ref_banc'}),
                        search.createColumn({name: 'trandate'}),
                        search.createColumn({name: "amountremaining", label: "Amount"}),
                        search.createColumn({name: 'entity'}),
                        search.createColumn({name: 'custbody_efx_fe_formapago'}),
                        search.createColumn({name: 'custbody_efx_fe_metodopago'}),
                        search.createColumn({name: 'custbody_efx_fe_usocfdi'}),
                        search.createColumn({name: 'custentity_efx_fe_usocfdi', join: 'customer'}),
                        search.createColumn({name: 'location'}),
                        search.createColumn({name: "amount", label: "Amount"}),
                        search.createColumn({name: 'internalid'}),
                        search.createColumn({name: "custbody_efx_alumno", label: "Alumno"}),
                        search.createColumn({name: "custbody_mx_customer_rfc", label: "Alumno"}),
                        search.createColumn({
                            name: "trandate",
                            sort: search.Sort.ASC,
                            label: "Fecha"
                        }),
                        search.createColumn({
                            name: "custbody_ref_banc",
                            sort: search.Sort.ASC,
                            label: "Referencia Bancaria"
                        })
                    ]
                });

                var ejecutar_facturas = busqueda_facturas.run();

                var resultado_facturas = ejecutar_facturas.getRange(0, 100);


                var facturas_array = [];
                var resultsInvoices ={total: 0, invoices:[]};

                for (var i = 0; i < resultado_facturas.length; i++) {
                    var fac_internalid = resultado_facturas[i].getValue({name: 'internalid'}) || '';
                    var fac_referencia = resultado_facturas[i].getValue({name: 'custbody_ref_banc'}) || '';
                    var fac_entity = resultado_facturas[i].getValue({name: 'entity'}) || '';
                    var custentity_efx_fe_usocfdi = resultado_facturas[i].getValue({name: 'custentity_efx_fe_usocfdi', join: 'customer'}) || '';
                    var fac_Fpago = resultado_facturas[i].getValue({name: 'custbody_efx_fe_formapago'}) || '';
                    var fac_Mpago = resultado_facturas[i].getValue({name: 'custbody_efx_fe_metodopago'}) || '';
                    var fac_Ucfdi = resultado_facturas[i].getValue({name: 'custbody_efx_fe_usocfdi'}) || '';
                    var fac_location = resultado_facturas[i].getValue({name: 'location'}) || '';
                    var fac_amount = resultado_facturas[i].getValue({name: 'amount'}) || '';
                    var fac_date = resultado_facturas[i].getValue({name: 'trandate'}) || '';
                    var fac_amountdue = resultado_facturas[i].getValue({name: 'amountremaining'}) || '';
                    var fac_son = resultado_facturas[i].getValue({name: 'custbody_efx_alumno'}) || '';
                    var fac_rfc = resultado_facturas[i].getValue({name: 'custbody_mx_customer_rfc'}) || '';

                    var configRecObj = config.load({
                        type: config.Type.USER_PREFERENCES
                    });
                    var dateFormat = configRecObj.getValue({
                        fieldId: 'DATEFORMAT'
                    });

                    log.debug({title: 'getOpenInvoices  dateFormat', details: dateFormat});

                    var mydateobject = moment(fac_date, dateFormat).toDate();
                    log.debug({title: 'getOpenInvoices  mydateobject', details: mydateobject});

                    fac_date = (mydateobject.getMonth() + 1) +"/"+ mydateobject.getDate() +"/" + mydateobject.getFullYear();

                    var fac_date_arr = fac_date.split("/");

                    var rfctype = geTypeRFC(fac_rfc);

                    resultsInvoices.total += parseFloat(fac_amountdue);

                    resultsInvoices.invoices.push({
                        internalid: fac_internalid,
                        custbody_ref_banc: fac_referencia,
                        entity:fac_entity,
                        custbody_efx_fe_formapago:fac_Fpago,
                        custbody_efx_fe_metodopago:fac_Mpago,
                        custbody_efx_fe_usocfdi:fac_Ucfdi,
                        location:fac_location,
                        amount:parseFloat(fac_amount),
                        trandate:fac_date,
                        month:fac_date_arr[0],
                        date:fac_date_arr[1],
                        year:fac_date_arr[2],
                        amountremaining:fac_amountdue,
                        custbody_efx_alumno:fac_son,
                        custbody_mx_customer_rfc: fac_rfc,
                        rfc_type: custentity_efx_fe_usocfdi
                    });
                }

                log.debug({title: 'getOpenInvoices - resultsInvoices', details: resultsInvoices});
                return resultsInvoices
            }catch (e) {
                log.error({title: '375Error ', details:e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic:true});
                logsys3.setValue({fieldId:'custrecord_tkio_origen_log',value: 1});
                logsys3.setValue({fieldId:'custrecord_tkio_txt_largo',value: e.message});
                logsys3.setValue({fieldId:'custrecord_tkio_fecha_log',value: datelog });
                logsys3.save();
                return false;
            }
        }

        const getPositiveBalance = (student, parent) => {
            try {
                //var ObjSal = [];
                var resultBalance = {total: 0, balances: []};
                var customrecord_tkio_saldo_afavor_padreSearchObj = search.create({
                    type: "customrecord_tkio_saldo_afavor_padre",
                    filters:
                        [
                            ["custrecord_tkio_saldo_hijoid",search.Operator.IS,student],
                            "AND",
                            ["custrecord_tkio_saldo_afavor_clitneteid",search.Operator.IS,parent]
                        ],
                    columns:
                        [
                            search.createColumn({name: "custrecord_tkio_saldo_padre_monto", label: "Monto"}),
                            search.createColumn({name: "internalid", label: "ID interno"})
                        ]
                });
                log.debug({title: 'getPositiveBalance - customrecord_tkio_saldo_afavor_padreSearchObj ', details:customrecord_tkio_saldo_afavor_padreSearchObj});
                var idFavor;
                var SaldoAFavor;
                customrecord_tkio_saldo_afavor_padreSearchObj.run().each(function(result){
                    /*idFavor = result.getValue({name: "internalid"})
                    SaldoAFavor = parseFloat(result.getValue({name: "custrecord_tkio_saldo_padre_monto"})) ;*/

                    resultBalance.total += parseFloat(result.getValue({name: "custrecord_tkio_saldo_padre_monto"}));
                    resultBalance.balances.push({
                       id:  result.getValue({name: "internalid"}),
                        amount: parseFloat(result.getValue({name: "custrecord_tkio_saldo_padre_monto"})) || 0
                    });

                    return true;
                });
                /*ObjSal.push({idFavor:idFavor,SaldoAFavor:SaldoAFavor})
                return ObjSal;*/
                log.debug({title: 'getPositiveBalance - resultBalance ', details:resultBalance});
                return resultBalance;

            }catch (e) {
                log.error({title: '674Error ', details:e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic:true});
                logsys3.setValue({fieldId:'custrecord_tkio_origen_log',value: 1});
                logsys3.setValue({fieldId:'custrecord_tkio_txt_largo',value: e.message});
                logsys3.setValue({fieldId:'custrecord_tkio_fecha_log',value: datelog });
                logsys3.save();
                return null;
            }
        }

        const summarize = (summaryContext) => {
            try{
                log.debug({title: 'summarize - summaryContext', details: summaryContext});
                var custscript_efx_db_id_detail = runtime.getCurrentScript().getParameter({name: 'custscript_efx_db_id_detail'});
                updateRecord("customrecord_efx_db_txt_banco", custscript_efx_db_id_detail, {"custrecord_efx_db_processing": "F", "custrecord_efx_cb_etapa": ""});
            }
            catch (e) {

            }
        }

        const getCustomer = (reference, iddetail, idTxt) => {
            try {
                var customrecord_efx_db_txt_referenciaSearchObj = search.create({
                    type: "customrecord_efx_db_txt_referencia",
                    filters:
                        [
                            ['custrecord_efx_db_ref_ref', search.Operator.IS, reference]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "scriptid",
                                sort: search.Sort.ASC,
                                label: "Script ID"
                            }),
                            search.createColumn({name: "custrecord_efx_db_gen_id", label: "ID para generar"}),
                            search.createColumn({name: "custrecord_efx_db_ref_ref", label: "Referencia"}),
                            search.createColumn({name: "custrecord_efx_db_ref_customer", label: "Alumno"}),
                            search.createColumn({name: "custrecord_efx_db_ref_item", label: "Articulo"}),
                          	search.createColumn({name: "custentity_efx_fe_usocfdi", join: "custrecord_efx_db_ref_customer", label: "Uso de CFDI"}),
                            search.createColumn({name: "parent", join: "custrecord_efx_db_ref_customer"})
                        ]
                });
                var  customerresults = customrecord_efx_db_txt_referenciaSearchObj.run().getRange({ start: 0,  end: 1000 });
                log.debug({title: 'getCustomer - customerresults ', details: customerresults});
                if(customerresults.length == 0){
                    updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_processed": "F", "custrecord_efx_db_notes": "No se ha encontrado un alumno con esta referencia."});
                    return -1;
                }
                else if(customerresults.length == 1){
                    var datacustomer = {
                        custrecord_efx_db_parent: customerresults[0].getValue({name: "parent", join: "custrecord_efx_db_ref_customer"}),
                        custrecord_efx_db_student: customerresults[0].getValue({name: "custrecord_efx_db_ref_customer"}),
                      	custrecord_efx_fe_usocfdi: customerresults[0].getValue({name: "custentity_efx_fe_usocfdi", join: "custrecord_efx_db_ref_customer", label: "Uso de CFDI"}),
                        custrecord_efx_db_notes: "",
                        custrecord_efx_db_processed: "F",
                    };
                    log.debug({title: 'getCustomer - datacustomer ', details: datacustomer});
                    updateRecord("customrecord_efx_db_txt_detalle", iddetail, datacustomer);
                    return 1;
                }
                else{
                    updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_processed": "F", "custrecord_efx_db_notes": "Se ha encontrado más de un alumno con esta referencia."});
                    return -2;
                }

            } catch (e) {
                log.error({title: '257Error ', details: e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic: true});
                logsys3.setValue({fieldId: 'custrecord_tkio_origen_log', value: 1});
                logsys3.setValue({fieldId: 'custrecord_tkio_txt_largo', value: e.message});
                logsys3.setValue({fieldId: 'custrecord_tkio_fecha_log', value: datelog});
                logsys3.save();
                updateRecord("customrecord_efx_db_txt_detalle", iddetail, {"custrecord_efx_db_processed": "F", "custrecord_efx_db_notes": "No ha sido posible obtener el alumno mediante la referencia."});
                updateRecord("customrecord_efx_db_txt_banco", idTxt, {"custrecord_efx_db_processing": "F"});
                return null;

            }
        }

        const geTypeRFC = (RFCstring) => {
            try{
                var RFC = RFCstring[3];
                var rfc_tipo = '';

                if(isNaN(parseInt(RFC))){
                    rfc_tipo = 21
                }else{
                    rfc_tipo = 3
                }
                return rfc_tipo
            }catch (e) {
                log.debug({title: '436Error ', details:e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic:true});
                logsys3.setValue({fieldId:'custrecord_tkio_origen_log',value: 1});
                logsys3.setValue({fieldId:'custrecord_tkio_txt_largo',value: e.message});
                logsys3.setValue({fieldId:'custrecord_tkio_fecha_log',value: datelog });
                logsys3.save();
                return 0;
            }
        }

        const getPositiveBalanceInfo = (parent, student) => {
            try {
                var ObjSal = [];
                var balanceresult = {};
                log.debug({title: 'getPositiveBalanceInfo  student', details: student});
                log.debug({title: 'getPositiveBalanceInfo  parent', details: parent});
                var customrecord_tkio_saldo_afavor_padreSearchObj = search.create({
                    type: "customrecord_tkio_saldo_afavor_padre",
                    filters:
                        [
                            ["custrecord_tkio_saldo_hijoid",search.Operator.IS,student],
                            "AND",
                            ["custrecord_tkio_saldo_afavor_clitneteid",search.Operator.IS,parent]
                        ],
                    columns:
                        [
                            search.createColumn({name: "custrecord_tkio_saldo_padre_monto", label: "Monto"}),
                            search.createColumn({name: "internalid", label: "ID interno"})
                        ]
                });
                var idFavor = 0;
                var SaldoAFavor = 0;
                customrecord_tkio_saldo_afavor_padreSearchObj.run().each(function(result){
                    idFavor = result.getValue({name: "internalid"});
                    SaldoAFavor = parseFloat(result.getValue({name: "custrecord_tkio_saldo_padre_monto"})) ;
                    return true;
                });
                balanceresult = {id:idFavor,amount:SaldoAFavor};
                log.debug({title: 'getPositiveBalanceInfo  balanceresult', details: balanceresult});
                //ObjSal.push({idbalancerecord:idFavor,amoount:SaldoAFavor})
                return balanceresult;
            }catch (e) {
                log.error({title: '674Error ', details:e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic:true});
                logsys3.setValue({fieldId:'custrecord_tkio_origen_log',value: 1});
                logsys3.setValue({fieldId:'custrecord_tkio_txt_largo',value: e.message});
                logsys3.setValue({fieldId:'custrecord_tkio_fecha_log',value: datelog });
                logsys3.save();
                return false;
            }
        }

        const addPositiveBalance = (idbalance, parent, student, amount) => {
            try{
                log.audit({title: 'addPositiveBalance - idbalance', details: idbalance});

                log.audit({title: 'addPositiveBalance - student', details: student});
                log.audit({title: 'addPositiveBalance - parent', details: parent});

                log.audit({title: 'addPositiveBalance - amount', details: amount});

                if(idbalance){

                    var balancerecord = record.load({type: 'customrecord_tkio_saldo_afavor_padre', id: idbalance , isDynamic:true});
                    var valuepositive = balancerecord.setValue({fieldId:'custrecord_tkio_saldo_padre_monto',value: amount });
                    balancerecord.setValue({fieldId:'custrecord_tkio_saldo_padre_monto',value: valuepositive*1 + amount });
                }else{

                    var balancerecord = record.create({type: 'customrecord_tkio_saldo_afavor_padre' , isDynamic:true});
                    balancerecord.setValue({fieldId:'custrecord_tkio_saldo_padre_monto',value: amount });
                    balancerecord.setValue({fieldId:'custrecord_tkio_saldo_afavor_clitneteid',value: parent });
                    balancerecord.setValue({fieldId:'custrecord_tkio_saldo_hijoid',value: student });
                }
                var recordId = balancerecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

                return recordId;
            }
            catch (e) {
                log.error({title: '2203Error ', details:e});
                var datelog = new Date();
                var logsys3 = record.create({type: 'customrecord_tkio_log_system', isDynamic:true});
                logsys3.setValue({fieldId:'custrecord_tkio_origen_log',value: 1});
                logsys3.setValue({fieldId:'custrecord_tkio_txt_largo',value: e.message});
                logsys3.setValue({fieldId:'custrecord_tkio_fecha_log',value: datelog });
                logsys3.save();
                return null;
            }
        }

        function updateRecord(type, id, values) {
            if(values.custrecord_efx_db_notes != "" && type == "customrecord_efx_db_txt_detalle" && values.custrecord_efx_db_notes){
                var fieldLookUp = search.lookupFields({
                    type: type,
                    id: id,
                    columns: ['custrecord_efx_db_notes']
                });
                var aux = '';
                if(fieldLookUp){
                    aux += fieldLookUp['custrecord_efx_db_notes'] + "\n";
                }

                aux += values.custrecord_efx_db_notes;
                values.custrecord_efx_db_notes = aux;
            }
            record.submitFields({
                type: type,
                id: id,
                values: values,
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields : true
                }
            });
        }

        return {getInputData, map, reduce, summarize}

    });