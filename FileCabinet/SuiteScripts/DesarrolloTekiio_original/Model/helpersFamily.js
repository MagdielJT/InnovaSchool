/**
 * @NApiVersion 2.1
 */
define(['N/format','N/record','N/file','N/http', 'N/https'],
    /**
 * @param{format} format
 */
    (format,record,file,http,https) => {

        const setStringDate = (min = 0,max = 0) => {
            let dates = getDatesFormal()
            if (min !== 0 && max !== 0)
                return "Agosto " + String(min) + " - Julio " + String(max)
            return dates.year > dates.period ? "Agosto " + dates.period + " - " + "Julio " + dates.year : "Agosto " + dates.year + " - " + "Julio " + dates.period
        }

        const setFormatDateOne = (minL = 0) => {
            let dates = getDatesFormal()
            let min = minL !== 0 ? minL : Math.min(dates.year,dates.period)
            return format.format({ type: format.Type.DATE, value: new Date( "08/01/" + String(min) ) })
        }
        const setFormatDateTwo = (maxL = 0) => {
            let dates = getDatesFormal()
            let max = maxL !== 0 ? maxL : Math.max(dates.year,dates.period)
            return format.format({ type: format.Type.DATE, value: new Date( "07/31/" + String(max))})
        }

        const getDatesFormal = () => {
            let currentTime = new Date()
            let year = currentTime.getFullYear()
            let period =  0 < (currentTime.getMonth() + 1) <= 7 ?  year - 1 : year + 1
            return {period:period,year:year}
        }
        const historial = (saldoAdeudadoCiclo,estadosEnviados,cicloEscolar,datos) => {
            try {
                var registroLista = record.create({
                    type: 'customrecord_tkio_estadocuenta_innfamily',
                    isDynamic: true,
                }).setValue({
                    fieldId: 'name',
                    value: cicloEscolar
                }).setValue({
                    fieldId: 'custrecord_tkio_cicloescolar_if',
                    value: cicloEscolar
                }).setValue({
                    fieldId: 'custrecord_tkio_estadocuenta_innovaf',
                    value: datos
                }).setValue({
                    fieldId: 'custrecord_tkio_estadocuenta_completo',
                    value: saldoAdeudadoCiclo
                }).setValue({
                    fieldId: 'custrecord_tkio_estadocuenta_enviado',
                    value: estadosEnviados
                }).setValue({
                    fieldId: 'custrecord_estimado_if',
                    value: 4
                })
                var idReg = registroLista.save({});
                log.audit({title:'IDreg',details: idReg })
                return idReg
            } catch (e) {
                log.debug({
                    title: "Error de Historial",
                    details: e
                })
            }
        }
        const updateHistorial = ( data ) => {
            try {
                
                let actualizaciones = record.load({
                    type: "customrecord_tkio_estadocuenta_innfamily",
                    id:data.id,
                    isDynamic: true,
                })

                if('estado' in data )
                    actualizaciones.setValue({
                        fieldId: 'custrecord_tkio_estadocuenta_innovaf',
                        value: data.estado
                    })
                    
                if('completo' in data )
                    actualizaciones.setValue({
                        fieldId: 'custrecord_tkio_estadocuenta_completo',
                        value: data.completo
                    })

                if('enviado' in data )
                    actualizaciones.setValue({
                        fieldId: 'custrecord_tkio_estadocuenta_enviado',
                        value: data.enviado
                    })

                if ('estimado' in data)
                    actualizaciones.setValue({
                        fieldId: 'custrecord_estimado_if',
                        value: 4
                    })

                return actualizaciones.save();
            } catch (e) {
                log.debug({
                    title: "Error de actualizacion",
                    details: e
                })
            }
        }

        const sendStatement = (response) => {
            try {
                // Ejemplos: 99754,99755,99756,99757
                let getFiles = response
                if( 'file' in getFiles )
                    getFiles = (JSON.parse(file.load({id:getFiles.file}).getContents())).data
                
                if( 'data' in getFiles)
                    getFiles = response.data
                
                // log.debug("*-**-",getFiles)
                let perChunk = 750
                let chunkPorAlumnos =  getFiles.reduce((resultArray, item, index) => { 
                    const chunkIndex = Math.floor(index/perChunk)
                    if(!resultArray[chunkIndex]) {
                        resultArray[chunkIndex] = [] 
                    }
                        
                    resultArray[chunkIndex].push(item)
                        
                    return resultArray
                }, [])
                // log.debug("Resultado dividido: ", chunkPorAlumnos.length)
                let estadosEnviados = true
                chunkPorAlumnos.forEach(element => {
                    var datosParaEnviar = JSON.stringify({"data":element})
                    var headers= {
                        'Accept': 'application/json',
                        "Cache-Control": "no-cache",
                        'User-Agent': 'Mozilla/5.0',
                        'Authorization': 'Bearer SW5ub3ZhOklubm92YQ==',
                        'Content-Type': 'application/json',
                        'Content-Length' : datosParaEnviar.length
                    }
                    // requestResponseGet = https.get({
                    //     // url: 'http://ec2-54-210-90-42.compute-1.amazonaws.com/api/json_data',
                    //     url: 'https://dmtest.innovaschools.edu.mx/api/json_data',
                    //     body: JSON.stringify({"data":element}),
                    //     headers: headers
                    // });
                    // log.debug("Get",requestResponseGet)

                    requestResponse = https.post({
                        // url: 'http://ec2-54-210-90-42.compute-1.amazonaws.com/api/json_data',
                        url: 'https://dmtest.innovaschools.edu.mx/api/json_data',
                        body: datosParaEnviar,
                        headers: headers
                    });
                    log.debug("Post",requestResponse)
                    if(!(JSON.parse(requestResponse.body)).success){
                        estadosEnviados = false
                    }
                });
                // log.debug("que pasa",estadosEnviados)
                return estadosEnviados
            } catch (e) {
                log.debug("Error de envio",e)
            }
        }
        const creadorArchivos = (element) => {
            
            switch (element.tipo) {
                case 'crear':
                    let fileObj = file.create({
                        name: element.nombre + '.json',
                        fileType: file.Type.JSON,
                        contents: JSON.stringify(element.datos)
                    });
                 
                    fileObj.folder = 34487;
                 
                    fileObj.save()

                    break;
                case 'editar':

                    break;
                default:
                    break;
            }
        }

        return {setStringDate, setFormatDateOne,setFormatDateTwo,historial,updateHistorial,sendStatement,creadorArchivos}

    });
