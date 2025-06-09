/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

inquirer.prompt([
  {
    type: 'input',
    name: 'string',
    message: 'Escreva o texto que você deseja converter em código QR:'
  }
]).then(answers => {
    // Gerar o código QR a partir do texto fornecido
    const qrImage = qr.imageSync(answers.string, { type: 'png' });

    // Salvar o código QR em um arquivo
    fs.writeFileSync('qr_code.png', qrImage);

    // Salvar o texto em um arquivo txt
    fs.writeFileSync('user_input.txt', answers.string);

    console.log('Código QR gerado e salvo como qr_code.png');
    console.log('Texto salvo em user_input.txt');
});''