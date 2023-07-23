const schemaConfig = {
    'class': '',
    'vectorizer': 'img2vec-neural',
    'vectorIndexType': 'hnsw',
    'moduleConfig': {
        'img2vec-neural': {
            'imageFields': [
                'image'
            ]
        }
    },
    'properties': [
        {
            'name': 'image',
            'dataType': ['blob']
        },   
        {
            'name': 'engineID',
            'dataType': ['text']
        },
        {  
            'name': 'imageID',
            'dataType': ['text']

        }

    ]
}
// console.log(schemaConfig.properties[1].dataType);
export default schemaConfig;