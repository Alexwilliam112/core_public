'use strict'
const fs = require('fs');
const { Cases } = require('./caseBuild')

function createJsonlEntry(systemContent, userContent, assistantContent) {
    return {
        messages: [
            { role: 'system', content: systemContent },
            { role: 'user', content: userContent },
            { role: 'assistant', content: assistantContent }
        ]
    };
}

function writeJsonlFile(filename, entries) {
    const stream = fs.createWriteStream(filename, { flags: 'a' });

    entries.forEach(entry => {
        stream.write(JSON.stringify(entry) + '\n');
    });

    stream.end();
}

function main(jobname) {
    const systemRole = `
    You are a financial analyst chatbot specialized in providing insights for a small restaurant business.
    Your tasks include analyzing data, identifying key trends, giving insights, and summarizing expense and income data.
    Your output format must be in sequence of: Key Trends, Insights, Summary
    `

    const entries = Cases.map((scenario) => {
        return createJsonlEntry(
            systemRole,
            scenario.userContent,
            scenario.assistantContent
        )
    })

    writeJsonlFile(`./utils/fineTuningJobs/${jobname}.jsonl`, entries);
    console.log('JSONL file written successfully.');
}

main('job_1')
