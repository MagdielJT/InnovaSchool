/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
 define(['N/log', 'N/record', 'N/redirect'],
 /**
  * @param{log} log
  * @param{record} record
  * @param{redirect} redirect
  */
 function(log, record, redirect) {
    
     /**
      * Function definition to be triggered before record is loaded.
      *
      * @param {Object} scriptContext
      * @param {Record} scriptContext.newRecord - New record
      * @param {string} scriptContext.type - Trigger type
      * @param {Form} scriptContext.form - Current form
      * @Since 2015.2
      */
     function beforeLoad(scriptContext) {
 
     }
 
     /**
      * Function definition to be triggered before record is loaded.
      *
      * @param {Object} scriptContext
      * @param {Record} scriptContext.newRecord - New record
      * @param {Record} scriptContext.oldRecord - Old record
      * @param {string} scriptContext.type - Trigger type
      * @Since 2015.2
      */
     function beforeSubmit(scriptContext) {
 
     }
 
     /**
      * Function definition to be triggered before record is loaded.
      *
      * @param {Object} scriptContext
      * @param {Record} scriptContext.newRecord - New record
      * @param {Record} scriptContext.oldRecord - Old record
      * @param {string} scriptContext.type - Trigger type
      * @Since 2015.2
      */
     function afterSubmit(scriptContext) {
         try {
             var recordObj = record.load({
                 type: scriptContext.newRecord.type,
                 id: scriptContext.newRecord.id,
                 isDynamic: true
             });
             // var recordObj = scriptContext.newRecord;
 
             /** Customer Info */
             var customer= recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_customer'});
             var customer_name= recordObj.getText({fieldId: 'custrecord_efx_ms_ca_customer'});
 
             /** Address Book Related */
             var related_address = recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_related_add'});
 
             var attention = recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_atention'});
 
             /** Address Info */
             var street = recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_street'});
             var number_ext = recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_number'});
             var number_int = recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_int_number'});
             var colonia = recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_col'});
             var city = recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_city'});
             var state = recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_state'});
             var zip_code = recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_zip_code'});
             var country = recordObj.getValue({fieldId: 'custrecord_efx_ms_ca_country'});
             var phone = recordObj.getText({fieldId: 'custrecord_efx_ms_ca_phone'});
 
             /** Address Info EFX-FE*/
             var numero = recordObj.getValue({ fieldId: 'custrecord_efx_ms_ca_fe_number' });
             var email = recordObj.getValue({ fieldId: 'custrecord_efx_ms_ca_mail_add' });
             var ce_pais = recordObj.getValue({ fieldId: 'custrecord_efx_ms_ca_fe_country' });
             var ce_estado = recordObj.getValue({ fieldId: 'custrecord_efx_ms_ca_fe_state' });
             var ce_municipio = recordObj.getValue({ fieldId: 'custrecord_efx_ms_ca_fe_city' });
             var ce_localidad = recordObj.getValue({ fieldId: 'custrecord_efx_ms_ca_fe_loc' });
             var ce_colonia = recordObj.getValue({ fieldId: 'custrecord_efx_ms_ca_fe_col' });
             var ce_destinatario = recordObj.getValue({ fieldId: 'custrecord_efx_ms_ca_fe_dest' });
 
             var address_defect = recordObj.getValue({ fieldId: 'custrecord_efx_ms_ca_kiosko' });
 
             var addressObj = {
                 address_id: recordObj.id,
                 customer_name: customer_name,
                 attention: attention,
                 street: street,
                 number_ext: number_ext,
                 number_int: number_int,
                 colonia: colonia,
                 city: city,
                 state: state,
                 zip_code: zip_code,
                 country: country,
                 phone: phone,
                 efx_fe: {
                     numero: numero,
                     email: email,
                     ce_pais: ce_pais,
                     ce_estado: ce_estado,
                     ce_municipio: ce_municipio,
                     ce_localidad: ce_localidad,
                     ce_colonia: ce_colonia,
                     ce_destinatario: ce_destinatario
                 },
                 csc_kiosko: {
                     address_defect: address_defect
                 }
             };
             log.audit('obj address', addressObj);
             if (!related_address) {
                  var id_add = createAddress(customer, addressObj);
                  var addressID = addAddressBook(id_add);
                 /* redirect.toRecord({
                     type : 'customrecord_efx_ms_custom_address',
                     id : addressID,
                     parameters: {}
                 }); */
             } else {
                 var id_update = updateAddress(customer, related_address, addressObj);
                 log.audit('id updadted', id_update);
             }
         } catch (e) {
             log.error('Error on afterSubmit', e);
         }
     }
 
     /**
      * This function creates a new address for a customer in NetSuite
      * @param customerID - The internal ID of the customer record.
      * @param addressObj - This is the object that contains the address information.
      * @returns The id of the record created.
      */
     function createAddress(customerID, addressObj) {
         try {
             var objRecord = record.load({
                 type: record.Type.CUSTOMER,
                 id: customerID,
                 isDynamic: true
             });
             var lineNum = objRecord.selectNewLine({
                 sublistId: 'addressbook'
             });
             objRecord.setCurrentSublistValue({
                 sublistId: 'addressbook',
                 fieldId: 'defaultbilling',
                 value: false,
                 ignoreFieldChange: true
             });
             objRecord.setCurrentSublistValue({
                 sublistId: 'addressbook',
                 fieldId: 'defaultshipping',
                 value: false,
                 ignoreFieldChange: true
             });
             objRecord.setCurrentSublistValue({
                 sublistId: 'addressbook',
                 fieldId: 'isresidential',
                 value: true,
                 ignoreFieldChange: true
             });
             objRecord.setCurrentSublistValue({
                 sublistId: 'addressbook',
                 fieldId: 'label',
                 value: addressObj.street,
                 ignoreFieldChange: true
             });
             subrecordAddBook = objRecord.getCurrentSublistSubrecord({
                 sublistId: 'addressbook',
                 fieldId: 'addressbookaddress'
             });
             /** Asignacion de dirección en subrecord */
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_ms_ca_add_related',
                 value: addressObj.address_id,
                 ignoreFieldChange: true
             });
             subrecordAddBook.setValue({
                 fieldId: 'attention',
                 value: addressObj.attention,
                 ignoreFieldChange: true
             });
             var countryCode = getCountryCode(addressObj.country);
             subrecordAddBook.setValue({
                 fieldId: 'country',
                 value: countryCode,
                 ignoreFieldChange: false
             });
             subrecordAddBook.setValue({
                 fieldId: 'addressee',
                 value: addressObj.customer_name,
                 ignoreFieldChange: false
             });
             subrecordAddBook.setValue({
                 fieldId: 'addrphone',
                 value: addressObj.phone
             });
             subrecordAddBook.setValue({
                 fieldId: 'addr1',
                 value: addressObj.street
             });
             subrecordAddBook.setValue({
                 fieldId: 'addr2',
                 value: addressObj.colonia
             });
             subrecordAddBook.setValue({
                 fieldId: 'CUSTRECORD_STREETNUM',
                 value: addressObj.number_ext
             });
             subrecordAddBook.setValue({
                 fieldId: 'addr3',
                 value: addressObj.number_int
             });
             subrecordAddBook.setValue({
                 fieldId: 'city',
                 value: addressObj.city
             });
             var stateCode = getStateCode(countryCode, addressObj.state);
             subrecordAddBook.setValue({
                 fieldId: 'state',
                 value: stateCode
             });
             subrecordAddBook.setValue({
                 fieldId: 'zip',
                 value: addressObj.zip_code
             });
             /** KIOSKO */
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_csc_kiosko_addres_defect',
                 value: addressObj.csc_kiosko.address_defect
             });
             /** EFX FE CE */
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_numero',
                 value: addressObj.efx_fe.numero
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_correo_electronico',
                 value: addressObj.efx_fe.email
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_pais',
                 value: addressObj.efx_fe.ce_pais
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_estado',
                 value: addressObj.efx_fe.ce_estado
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_municipio',
                 value: addressObj.efx_fe.ce_municipio
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_localidad',
                 value: addressObj.efx_fe.ce_localidad
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_colonia',
                 value: addressObj.efx_fe.ce_colonia
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_destinatario',
                 value: addressObj.efx_fe.ce_destinatario
             });
 
 
             objRecord.commitLine({
                 sublistId: 'addressbook'
             });
             var idrecord = objRecord.save({
                 ignoreMandatoryFields: true,
                 enableSourcing: true
             });
             return idrecord;
         } catch (e) {
             log.error('Error on createAddress', e);
         }
     }
 
     function getCountryCode(countryID) {
         try {
             var code = null;
             switch (countryID) {
                 case 157:
                 case '157':
                     code = 'MX';
                     break;
                 case 230:
                 case '230':
                     code = 'US';
                     break;
             }
             return code;
         } catch (e) {
             log.error('Error on getCountryCode', e);
         }
     }
 
     function getStateCode(countryCode, stateID) {
         try {
             var code = null;
             if (countryCode === 'MX') {
                 switch (stateID) {
                     case 500:
                     case '500':
                         code = 'AGS';
                         break;
                     case 532:
                     case '532':
                         code = 'BC';
                         break;
                     case 502:
                     case '502':
                         code = 'BCS';
                         break;
                     case 503:
                     case '503':
                         code = 'CAM';
                         break;
                     case 504:
                     case '504':
                         code = 'CHIS';
                         break;
                     case 505:
                     case '505':
                         code = 'CHIH';
                         break;
                     case 506:
                     case '506':
                         code = 'COAH';
                         break;
                     case 507:
                     case '507':
                         code = 'COL';
                         break;
                     case 508:
                     case '508':
                         code = 'DF';
                         break;
                     case 509:
                     case '509':
                         code = 'DGO';
                         break;
                     case 510:
                     case '510':
                         code = 'GTO';
                         break;
                     case 511:
                     case '511':
                         code = 'GRO';
                         break;
                     case 512:
                     case '512':
                         code = 'HGO';
                         break;
                     case 513:
                     case '513':
                         code = 'JAL';
                         break;
                     case 533:
                     case '533':
                         code = 'CDMX';
                         break;
                     case 515:
                     case '515':
                         code = 'MICH';
                         break;
                     case 516:
                     case '516':
                         code = 'MOR';
                         break;
                     case 514:
                     case '514':
                         code = 'MEX';
                         break;
                     case 517:
                     case '517':
                         code = 'NAY';
                         break;
                     case 518:
                     case '518':
                         code = 'NL';
                         break;
                     case 519:
                     case '519':
                         code = 'OAX';
                         break;
                     case 520:
                     case '520':
                         code = 'PUE';
                         break;
                     case 521:
                     case '521':
                         code = 'QRO';
                         break;
                     case 522:
                     case '522':
                         code = 'QROO';
                         break;
                     case 523:
                     case '523':
                         code = 'SLP';
                         break;
                     case 524:
                     case '524':
                         code = 'SIN';
                         break;
                     case 525:
                     case '525':
                         code = 'SON';
                         break;
                     case 526:
                     case '526':
                         code = 'TAB';
                         break;
                     case 527:
                     case '527':
                         code = 'TAMPS';
                         break;
                     case 528:
                     case '528':
                         code = 'TLAX';
                         break;
                     case 529:
                     case '529':
                         code = 'VER';
                         break;
                     case 530:
                     case '530':
                         code = 'YUC';
                         break;
                     case 531:
                     case '531':
                         code = 'ZAC';
                         break;
                 }
             }
             if (countryCode === 'US') {
                 switch (stateID) {
                     case 0:
                     case '0':
                         code = 'AL';
                         break;
                     case 1:
                     case '1':
                         code = 'AK';
                         break;
                     case 2:
                     case '2':
                         code = 'AZ';
                         break;
                     case 3:
                     case '3':
                         code = 'AR';
                         break;
                     case 53:
                     case '53':
                         code = 'AA';
                         break;
                     case 52:
                     case '52':
                         code = 'AE';
                         break;
                     case 54:
                     case '54':
                         code = 'AP';
                         break;
                     case 4:
                     case '4':
                         code = 'CA';
                         break;
                     case 5:
                     case '5':
                         code = 'CO';
                         break;
                     case 6:
                     case '6':
                         code = 'CT';
                         break;
                     case 7:
                     case '7':
                         code = 'DE';
                         break;
                     case 8:
                     case '8':
                         code = 'DC';
                         break;
                     case 9:
                     case '9':
                         code = 'FL';
                         break;
                     case 10:
                     case '10':
                         code = 'GA';
                         break;
                     case 11:
                     case '11':
                         code = 'HI';
                         break;
                     case 12:
                     case '12':
                         code = 'ID';
                         break;
                     case 13:
                     case '13':
                         code = 'IL';
                         break;
                     case 14:
                     case '14':
                         code = 'IN';
                         break;
                     case 15:
                     case '15':
                         code = 'IA';
                         break;
                     case 16:
                     case '16':
                         code = 'KS';
                         break;
                     case 17:
                     case '17':
                         code = 'KY';
                         break;
                     case 18:
                     case '18':
                         code = 'LA';
                         break;
                     case 19:
                     case '19':
                         code = 'ME';
                         break;
                     case 20:
                     case '20':
                         code = 'MD';
                         break;
                     case 21:
                     case '21':
                         code = 'MA';
                         break;
                     case 22:
                     case '22':
                         code = 'MI';
                         break;
                     case 23:
                     case '23':
                         code = 'MN';
                         break;
                     case 24:
                     case '24':
                         code = 'MS';
                         break;
                     case 25:
                     case '25':
                         code = 'MO';
                         break;
                     case 26:
                     case '26':
                         code = 'MT';
                         break;
                     case 27:
                     case '27':
                         code = 'NE';
                         break;
                     case 28:
                     case '28':
                         code = 'NV';
                         break;
                     case 29:
                     case '29':
                         code = 'NH';
                         break;
                     case 30:
                     case '30':
                         code = 'NJ';
                         break;
                     case 31:
                     case '31':
                         code = 'NM';
                         break;
                     case 32:
                     case '32':
                         code = 'NY';
                         break;
                     case 33:
                     case '33':
                         code = 'NC';
                         break;
                     case 34:
                     case '34':
                         code = 'ND';
                         break;
                     case 35:
                     case '35':
                         code = 'OH';
                         break;
                     case 36:
                     case '36':
                         code = 'OK';
                         break;
                     case 37:
                     case '37':
                         code = 'OR';
                         break;
                     case 38:
                     case '38':
                         code = 'PA';
                         break;
                     case 39:
                     case '39':
                         code = 'PR';
                         break;
                     case 40:
                     case '40':
                         code = 'RI';
                         break;
                     case 41:
                     case '41':
                         code = 'SC';
                         break;
                     case 42:
                     case '42':
                         code = 'SD';
                         break;
                     case 43:
                     case '43':
                         code = 'TN';
                         break;
                     case 44:
                     case '44':
                         code = 'TX';
                         break;
                     case 45:
                     case '45':
                         code = 'UT';
                         break;
                     case 46:
                     case '46':
                         code = 'VT';
                         break;
                     case 47:
                     case '47':
                         code = 'VA';
                         break;
                     case 48:
                     case '48':
                         code = 'WA';
                         break;
                     case 49:
                     case '49':
                         code = 'WV';
                         break;
                     case 50:
                     case '50':
                         code = 'WI';
                         break;
                     case 51:
                     case '51':
                         code = 'WY';
                         break;
                 }
             }
             return code;
         } catch (e) {
             log.error('Error on getStateCode', e);
         }
     }
 
     function addAddressBook (customerID) {
         try {
             var objRecord = record.load({
                 type: record.Type.CUSTOMER,
                 id: customerID,
                 isDynamic: false
             });
             var numLines = objRecord.getLineCount({
                 sublistId: 'addressbook'
             });
             var id_address = objRecord.getSublistValue({
                 sublistId: 'addressbook',
                 fieldId: 'id',
                 line: (numLines - 1)
             });
             var objSubRcord = objRecord.getSublistSubrecord({
                 sublistId: 'addressbook',
                 fieldId: 'addressbookaddress',
                 line: (numLines - 1)
             });
             var address_related = objSubRcord.getValue({fieldId: 'custrecord_efx_ms_ca_add_related'});
             log.audit('Data add address', {id_address: id_address, address_related: address_related});
             var addressID = record.submitFields({
                 type: 'customrecord_efx_ms_custom_address',
                 id: address_related,
                 values: {
                     'custrecord_efx_ms_ca_related_add': id_address
                 },
                 options: {
                     enableSourcing: false,
                     ignoreMandatoryFields : true
                 }
             });
             log.audit('Id updated', addressID);
             return addressID
         } catch (e) {
             log.error('Error on addAddressBook', e);
         }
     }
 
     function updateAddress(customerID, addressID, addressObj) {
         try {
             var objRecord = record.load({
                 type: record.Type.CUSTOMER,
                 id: customerID,
                 isDynamic: true
             });
 
             var totalLines = objRecord.getLineCount({sublistId: 'addressbook'});
             log.audit('totalLines', totalLines);
             var line = null;
             for (var i = 0; i < totalLines; i++) {
                 var id_line = objRecord.getSublistValue({sublistId: 'addressbook', fieldId: 'id', line: i});
                 log.audit('Comparative id', {id_line: id_line, addressID: addressID});
                 if(parseInt(id_line) === parseInt(addressID)){
                     line = i;
                     break;
                 }
             }
             log.audit('line selected', line);
             var lineNum = objRecord.selectLine({
                 sublistId: 'addressbook',
                 line: line
             });
 
             objRecord.setCurrentSublistValue({
                 sublistId: 'addressbook',
                 fieldId: 'label',
                 value: addressObj.street,
                 ignoreFieldChange: true
             });
             subrecordAddBook = objRecord.getCurrentSublistSubrecord({
                 sublistId: 'addressbook',
                 fieldId: 'addressbookaddress'
             });
             /** Asignacion de dirección en subrecord */
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_ms_ca_add_related',
                 value: addressObj.address_id,
                 ignoreFieldChange: true
             });
 
             subrecordAddBook.setValue({
                 fieldId: 'attention',
                 value: addressObj.attention,
                 ignoreFieldChange: true
             });
             var countryCode = getCountryCode(addressObj.country);
             subrecordAddBook.setValue({
                 fieldId: 'country',
                 value: countryCode,
                 ignoreFieldChange: false
             });
             subrecordAddBook.setValue({
                 fieldId: 'addressee',
                 value: addressObj.customer_name,
                 ignoreFieldChange: false
             });
             subrecordAddBook.setValue({
                 fieldId: 'addrphone',
                 value: addressObj.phone
             });
             subrecordAddBook.setValue({
                 fieldId: 'addr1',
                 value: addressObj.street
             });
             subrecordAddBook.setValue({
                 fieldId: 'addr2',
                 value: addressObj.colonia
             });
             subrecordAddBook.setValue({
                 fieldId: 'CUSTRECORD_STREETNUM',
                 value: addressObj.number_ext
             });
             subrecordAddBook.setValue({
                 fieldId: 'addr3',
                 value: addressObj.number_int
             });
             subrecordAddBook.setValue({
                 fieldId: 'city',
                 value: addressObj.city
             });
             subrecordAddBook.setValue({
                 fieldId: 'state',
                 value: addressObj.state
             });
             subrecordAddBook.setValue({
                 fieldId: 'zip',
                 value: addressObj.zip_code
             });
             /** KIOSKO */
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_csc_kiosko_addres_defect',
                 value: addressObj.csc_kiosko.address_defect
             });
             /** EFX FE CE */
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_numero',
                 value: addressObj.efx_fe.numero
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_correo_electronico',
                 value: addressObj.efx_fe.email
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_pais',
                 value: addressObj.efx_fe.ce_pais
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_estado',
                 value: addressObj.efx_fe.ce_estado
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_municipio',
                 value: addressObj.efx_fe.ce_municipio
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_localidad',
                 value: addressObj.efx_fe.ce_localidad
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_colonia',
                 value: addressObj.efx_fe.ce_colonia
             });
             subrecordAddBook.setValue({
                 fieldId: 'custrecord_efx_fe_ce_destinatario',
                 value: addressObj.efx_fe.ce_destinatario
             });
 
 
             objRecord.commitLine({
                 sublistId: 'addressbook'
             });
             var idrecord = objRecord.save({
                 ignoreMandatoryFields: true,
                 enableSourcing: true
             });
             return idrecord;
         } catch (e) {
             log.error('Error on updateAddress', e);
         }
     }
 
     return {
         afterSubmit: afterSubmit
     };
     
 });
 