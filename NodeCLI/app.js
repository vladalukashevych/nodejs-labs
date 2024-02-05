const user = require("./user")
const yargs = require('yargs/yargs');

yargs(process.argv.slice(2))
    .command({
        command: 'add',
        desc: 'Add new language',
        builder: {
            title: {
                type: 'string',
                demandOption: true,
                describe: 'Language title'
            },
            level:
                {
                    describe: 'Level of Knowledge',
                    demandOption: true,
                    type: 'string'
                }
        },
        handler: (argv) => {
            user.add({title: argv.title, level: argv.level})
            console.log("Added: " + {title: argv.title, level: argv.level})
        }
    })
    .command({
        command: 'remove',
        desc: 'Remove language',
        builder: {
            title: {
                type: 'string',
                demandOption: true,
                describe: 'Language title'
            }
        },
        handler: (argv) => {
            user.remove(argv.title)
            console.log("Removed: " + argv.title)
        }
    })
    .command({
        command: 'list',
        aliases: ['ls'],
        desc: 'Get language list',
        handler: () => {
            user.list()
        }
    })
    .command({
        command: 'read',
        desc: 'Read language',
        builder: {
            title: {
                describe: 'Language title',
                type: 'string',
                demandOption: true
            }
        },
        handler: (argv) => {
            user.read(argv.title);
        }
    })
    .parse()