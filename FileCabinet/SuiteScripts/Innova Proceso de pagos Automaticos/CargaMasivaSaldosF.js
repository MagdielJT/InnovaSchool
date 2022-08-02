/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/log', 'N/record', 'N/search','N/runtime','N/file'],
    /**
     * @param{log} log
     * @param{record} record
     * @param{search} search
     */
    (log, record, search, runtime,file) => {
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
            var parametros = JSON.parse(runtime.getCurrentScript().getParameter('custscript_tkio_documeto_id'));

            log.audit({title: 'parametros', details: parametros});

            var fileSearchObj = search.create({
                type: "file",
                filters:
                    [
                        ["internalid","anyof",parametros]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({name: "folder", label: "Folder"}),
                        search.createColumn({name: "documentsize", label: "Size (KB)"}),
                        search.createColumn({name: "url", label: "URL"}),
                        search.createColumn({name: "created", label: "Date Created"}),
                        search.createColumn({name: "modified", label: "Last Modified"}),
                        search.createColumn({name: "filetype", label: "Type"})
                    ]
            });


            return fileSearchObj;

        }


        const map = (mapContext) => {


            try {

                var datos = JSON.parse(mapContext.value);

                var peticion = datos.id;

                mapContext.write({
                    key: peticion,
                    value: datos.values
                });

            } catch (e) {
                log.error({title: 'map - error', details: e});
            }

        }

        const reduce = (reduceContext) => {
            try {
                var data = JSON.parse(reduceContext.values[0]);
                log.audit({title: 'map - data', details: data});

                var fileID;
                var fileType;
                var clientePadre = [];
                var clienteHijo = [];
                var relacionHijoPadre = [];

                var BusquedaPadres = search.create({
                    type: "customer",
                    filters:
                        [
                            ["category","anyof","1"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "entityid",
                                sort: search.Sort.ASC,
                                label: "ID"
                            }),
                            search.createColumn({name: "altname", label: "Name"}),
                            search.createColumn({name: "email", label: "Email"}),
                            search.createColumn({name: "phone", label: "Phone"}),
                            search.createColumn({name: "internalid", label: "Internal ID"})
                        ]
                });
                var searchResultCountPadres = BusquedaPadres.runPaged().count;
                log.debug("padres result count",searchResultCountPadres);
                BusquedaPadres.run().each(function(result){
                    clientePadre.push(result.getValue({name: "internalid"}))
                    return true;
                });

                var BusquedaHijos = search.create({
                    type: "customer",
                    filters:
                        [
                            ["category","anyof","2"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "entityid",
                                sort: search.Sort.ASC,
                                label: "ID"
                            }),
                            search.createColumn({name: "altname", label: "Name"}),
                            search.createColumn({name: "email", label: "Email"}),
                            search.createColumn({name: "phone", label: "Phone"}),
                            search.createColumn({name: "internalid", label: "Internal ID"}),
                            search.createColumn({
                                name: "internalid",
                                join: "parentCustomer",
                                label: "Internal ID"
                            })
                        ]
                });
                var searchResultCountHijos = BusquedaHijos.runPaged().count;
                log.debug("Hijos result count",searchResultCountHijos);
                BusquedaHijos.run().each(function(result){
                    clienteHijo.push(result.getValue({name: "internalid"}))
                    relacionHijoPadre.push(result.getValue({name: "internalid", join: "parentCustomer"}))

                    return true;
                });

                var folder = '-20';

                var archivo = data
                

                var busqueda_archivo = search.create({
                    type: search.Type.FOLDER,
                    filters: [
                        ['internalid', search.Operator.IS, folder]
                        , 'and',
                        ['file.name', search.Operator.IS, archivo.name]
                    ],
                    columns: [
                        search.createColumn({name: 'internalid'}),
                    ]
                });
                var ejecutar_archivo = busqueda_archivo.run();
                log.audit({title: 'ejecutar_archivo', details: ejecutar_archivo});
                var resultado_archivo = ejecutar_archivo.getRange(0, 100);
                log.audit({title: 'resultado_archivo', details: resultado_archivo});
                log.audit({title: 'resultado_archivo', details: resultado_archivo.length});
                log.audit({title: 'tipo', details:  archivo.fileType});


                if(resultado_archivo.length<=0) {
                    log.audit({title: 'no existe'});
                    log.debug({title: 'EL ARCHIVO CARGADO ES UN CSV', details: ''});
                    var documento = archivo;
                    documento.name = archivo.name;
                    documento.folder = folder;
                    var id_doc = documento.save();
                    log.audit({title: 'id_doc', details: id_doc});
                    var fileContent = file.load({
                        id: id_doc
                    });
                    var contenido_file = fileContent.getContents();

                    var iterator = fileContent.lines.iterator();
                    var fileLines = fileContent.lines;

                    log.audit({title: 'contenido_file', details: contenido_file});
                    log.audit({title: 'fileType', details: fileType});
                    log.audit({title: 'iterator', details: iterator});
                    iterator.each(function() {
                        return false;
                    });
                    iterator.each(function (line) {
                        var lineValues = line.value.split(',');
                        log.audit({title: 'lineValues', details: lineValues});
                        var clienteD = lineValues[0];
                        var tipoD= lineValues[1];
                        log.audit({title: 'lineValues', details: lineValues});

                        log.audit({title: 'relacionHijoPadre', details: relacionHijoPadre});
                        log.audit({title: 'clienteHijo.length', details: clienteHijo.length});
                        var relacion = '';
                        var nameReg = 'customrecord_tkio_saldo_afavor';
                        for(var iH = 0 ;iH<clienteHijo.length;iH++){
                            if(clienteD==clienteHijo[iH]){
                                relacion = relacionHijoPadre[iH];
                                log.audit({title: 'relacionHijoPadre[iH]', details: relacionHijoPadre[iH]});
                                break;
                            }
                        }

                        var objRecord = record.create({
                            type: nameReg ,
                            isDynamic: true
                        });
                        objRecord.setValue({
                            fieldId: 'custrecord_tkio_cliente_saf',
                            value: lineValues[0]
                        });
                        if(relacion){
                            objRecord.setValue({
                                fieldId: 'custrecord_tkio_saldo_padre',
                                value: relacion
                            });
                        }


                        objRecord.setValue({
                            fieldId: 'custrecord_tkio_monto_favor',
                            value: lineValues[1]
                        });
                        var recordId = objRecord.save();
                        log.audit({title: 'recordId', details:  recordId});
                        /* var esPadre=false;
                         var esHijo=false;
                         var relacion;
 
                         for(var iP = 0 ;iP<clientePadre.length;iP++){
                             if(clientePadre[iP]==clienteD){
                                 esPadre = true;
                                 break;
                             }
                         }
                         for(var iH = 0 ;iH<clienteHijo.length;iH++){
                             if(clientePadre[iH]==clienteD){
                                 for(var iP1 = 0 ;iP1<clientePadre.length;iP1++){
                                     if(clientePadre[iP1]==relacionHijoPadre[iH]){
                                         relacion = relacio.nHijoPadre[iH];
                                         break;
                                     }
                                 }
                                 esHijo = true;
                                 break;
                             }
                         }
                         var nameReg = '';
                         if(esPadre==true){
                             nameReg = 'customrecord_tkio_saldo_afavor_padre'
                         }
                         if(esHijo==true){
                             nameReg = 'customrecord_tkio_saldo_afavor'
                         }
 
                        c
                         if(esHijo==true){
                             objRecord.setValue({
                                 fieldId: 'custrecord_tkio_saldo_afavor_clitneteid',
                                 value: lineValues[0]
                             });
                             objRecord.setValue({
                                 fieldId: 'custrecord_tkio_saldo_padre',
                                 value: relacion
                             });
 
                             objRecord.setValue({
                                 fieldId: 'custrecord_tkio_monto_favor',
                                 value: lineValues[2]
                             });
                             var recordId = objRecord.save();
                         }
                         if(esPadre==true){
                             objRecord.setValue({
                                 fieldId: 'custrecord_tkio_cliente_saf',
                                 value: lineValues[0]
                             });
 
                             objRecord.setValue({
                                 fieldId: 'custrecord_tkio_saldo_padre_monto',
                                 value: lineValues[2]
                             });
                             var recordId = objRecord.save();
                         }
                         log.audit({title: 'recordId', details: recordId});
 
                         return true;*/
                    });




                }else{
                    log.audit({title: 'existe'});

                    var fileSearchObj = search.create({
                        type: "file",
                        filters:
                            [
                                ["name","haskeywords",archivo.name]
                            ],
                        columns:
                            [
                                search.createColumn({
                                    name: "name",
                                    sort: search.Sort.ASC,
                                    label: "Nombre"
                                }),
                                search.createColumn({name: "filetype", label: "Tipo"}),
                                search.createColumn({name: "internalid", label: "ID interno"}),

                            ]
                    });

                    fileSearchObj.run().each(function(result){
                        fileID   = result.getValue({name: "internalid"});
                        fileType = result.getValue({name: "filetype"});
                        return true;
                    });

                    log.audit({title: 'fileID', details: fileID});

                    var fileContent = file.load({
                        id: fileID
                    });
                    var contenido_file = fileContent.getContents();
                    log.audit({title: 'fileContent', details: fileContent});

                    var iterator = fileContent.lines.iterator();
                    var fileLines = fileContent.lines;

                    log.audit({title: 'contenido_file', details: contenido_file});
                    log.audit({title: 'fileType', details: fileType});
                    log.audit({title: 'iterator', details: iterator});
                    iterator.each(function() {
                        return false;
                    });
                    iterator.each(function (line) {
                        var lineValues = line.value.split(',');
                        var clienteD = lineValues[0];
                        var tipoD= lineValues[1];
                        log.audit({title: 'lineValues', details: lineValues});

                        log.audit({title: 'relacionHijoPadre', details: relacionHijoPadre});
                        log.audit({title: 'clienteHijo.length', details: clienteHijo.length});
                        var relacion = '';
                        var nameReg = 'customrecord_tkio_saldo_afavor';
                        for(var iH = 0 ;iH<clienteHijo.length;iH++){
                            if(clienteD==clienteHijo[iH]){
                                relacion = relacionHijoPadre[iH];
                                log.audit({title: 'relacionHijoPadre[iH]', details: relacionHijoPadre[iH]});
                                break;
                            }
                        }

                        var objRecord = record.create({
                            type: nameReg ,
                            isDynamic: true
                        });
                        objRecord.setValue({
                            fieldId: 'custrecord_tkio_cliente_saf',
                            value: lineValues[0]
                        });
                        if(relacion){
                            objRecord.setValue({
                                fieldId: 'custrecord_tkio_saldo_padre',
                                value: relacion
                            });
                        }


                        objRecord.setValue({
                            fieldId: 'custrecord_tkio_monto_favor',
                            value: lineValues[1]
                        });
                        var recordId = objRecord.save();
                        log.audit({title: 'recordId', details:  recordId});
                        /* var esPadre=false;
                         var esHijo=false;
 
                         for(var iP = 0 ;iP<clientePadre.length;iP++){
                             if(clientePadre[iP]==clienteD){
                                 esPadre = true;
                                 break;
                             }
                         }
                         for(var iH = 0 ;iH<clienteHijo.length;iH++){
                             if(clientePadre[iH]==clienteD){
                                 esHijo = true;
                                 break;
                             }
                         }
                         var nameReg = '';
                         if(esPadre==true){
                             nameReg = 'customrecord_tkio_saldo_afavor'
                         }
                         if(esHijo==true){
                             nameReg = 'customrecord_tkio_saldo_afavor_padre'
                         }
 
                         var objRecord = record.create({
                             type: nameReg ,
                             isDynamic: true
                         });
                         if(esHijo==true){
                             objRecord.setValue({
                                 fieldId: 'custrecord_tkio_saldo_afavor_clitneteid',
                                 value: lineValues[0]
                             });
                             objRecord.setValue({
                                 fieldId: 'custrecord_tkio_saldo_hijoid',
                                 value: lineValues[1]
                             });
                             objRecord.setValue({
                                 fieldId: 'custrecord_tkio_saldo_padre_monto',
                                 value: lineValues[1]
                             });
                             var recordId = objRecord.save();
                         }
                         if(esPadre==true){
                             objRecord.setValue({
                                 fieldId: 'custrecord_tkio_cliente_saf',
                                 value: lineValues[0]
                             });
                             /*objRecord.setValue({
                                 fieldId: 'custrecord_tkio_saldo_padre',
                                 value: lineValues[1]
                             });
                             objRecord.setValue({
                                 fieldId: 'custrecord_tkio_monto_favor',
                                 value: lineValues[2]
                             });
                             var recordId = objRecord.save();
                         }*/
                        log.audit({title: 'recordId', details: recordId});

                        return true;
                    });

                
                }

            }catch (e) {

                log.audit({title:'error', details: e})


            }

        }

        const summarize = (summaryContext) => {

        }
        
        return {getInputData, map, reduce, summarize}

    });
