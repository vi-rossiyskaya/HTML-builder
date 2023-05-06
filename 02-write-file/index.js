const fs = require('node:fs');
const readline = require('node:readline');
const path = require('node:path');
const { stdin: input, stdout: output } = require('node:process');
const filePath = path.join(__dirname, './output.txt');
const rl = readline.createInterface({ input, output });

fs.writeFile(filePath, '', (error) => {
  if (error) console.error(error.message);
});

output.write('Could you suggest a song?\n');

rl.on('line', (answer) => {
  if (answer === 'exit') {
    rl.close();
  } else if (answer === '') {
    rl.setPrompt('If you want to quit write \'exit\'\n');
    rl.prompt();
  } else {
    fs.appendFile(filePath, answer + '\n', (error) => {
      if (error) console.error(error.message);
    });
    rl.setPrompt('What other songs are on your list of favorites? \nIf you want to quit write \'exit\'\n');
    rl.prompt();
  }
});

rl.on('close', () => {
  output.write('Have a nice day!\n');
});

rl.on('error', (error) => console.error(error.message));
