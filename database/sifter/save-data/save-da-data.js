const https = require('https');
const fs = require('fs');
const path = require('path');

async function downloadFiles(baseUrl, pathTemplate) {
    let index = 0;
    let isEnd = false
    while (!isEnd) {
        const url = `${baseUrl}${pathTemplate.replace('{index}', index)}`;
        const filePath = path.join(__dirname, `f-${index}.json`);

        try {
            const fileStream = fs.createWriteStream(filePath);
            await new Promise((resolve, reject) => {
                https.get(url, (response) => {
                    if (response.statusCode === 404) {
                        fs.unlinkSync(filePath); // Clean up the empty file created
                        console.log(`File not found: ${url}`);
                        resolve('not found');
                        isEnd = true;
                        return;
                    }

                    if (response.statusCode !== 200) {
                        console.error(`Failed to get '${url}' (${response.statusCode})`);
                        reject(new Error(`Failed to get '${url}'`));
                        return;
                    }

                    response.pipe(fileStream);

                    fileStream.on('finish', () => {
                        console.log(`Downloaded file: ${filePath}`);
                        resolve();
                    });

                    fileStream.on('error', (err) => {
                        console.error(`Error writing to file: ${err}`);
                        reject(err);
                    });
                }).on('error', (err) => {
                    console.error(`Error fetching file: ${err}`);
                    reject(err);
                });
            });

            if (filePath === 'not found') {
                break;
            }

            index++;
        } catch (error) {
            console.error(`Error processing file: ${error}`);
            break;
        }
    }
}

const baseUrl = 'https://diamondthumb.com/forDoge-43/filesForDoge/';
const pathTemplate = 'f-{index}.json';

downloadFiles(baseUrl, pathTemplate);
