'use strict'
const { PayrollDetail, PayrollExpense, Employment, RoutineExpense, ExpenseType,
    Sale, SalesDetail, Buying, BuyingDetail, sequelize } = require('../models')
const { Op, fn, col } = require('sequelize');
const OpenAI = require("openai");

//OPENAI SETUP
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

class ReportsController {

    static async generalreport(req, res, next) {
        try {
            const { startDate, endDate } = req.query
            if (!startDate || !endDate) throw { name: 'ReportNoDate' }

            let employeeCount
            let payrolls
            let buyings
            let routines
            let sales

            await sequelize.transaction(async (t) => {

                employeeCount = await Employment.count({
                    where: {
                        docStatus: 'Active'
                    }
                })

                payrolls = await PayrollExpense.findAll({
                    attributes: [
                        [fn('to_char', col('date'), 'YYYY-MM-DD'), 'date'],
                        'amount'
                    ],
                    where: {
                        date: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                }, { transaction: t })

                buyings = await Buying.findAll({
                    attributes: [
                        [fn('to_char', col('date'), 'YYYY-MM-DD'), 'date'],
                        'amount'
                    ],
                    where: {
                        date: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                }, { transaction: t })

                routines = await RoutineExpense.findAll({
                    attributes: [
                        [fn('to_char', col('date'), 'YYYY-MM-DD'), 'date'],
                        'amount'
                    ],
                    where: {
                        date: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                }, { transaction: t })

                sales = await Sale.findAll({
                    attributes: [
                        [fn('to_char', col('createdAt'), 'YYYY-MM-DD'), 'date'],
                        'amount'
                    ],
                    where: {
                        createdAt: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                }, { transaction: t })
            })

            const data = {
                period: `${startDate} to ${endDate}`,
                employeeCount,
                payroll_expenses: payrolls,
                utility_expenses: routines,
                suppliy_expenses: buyings,
                income_sales: sales
            }
            const promptData = JSON.stringify(data)

            const prompt = `
            Analyze this financial data of a small restaurant business. Provide me with: key trends analysis, insight, and summarize, use these key words specifically: "KEY TRENDS:", "INSIGHT:", "SUMMARY:", "SUGGESTIONS:".
            Provide those 4 task sequentially
            The data is:
            ${promptData}`

            const chatCompletion = await openai.chat.completions.create({
                model: "ft:gpt-3.5-turbo-1106:personal::9ZASmzso",
                messages: [{ "role": "user", "content": `${prompt}` }],
            });

            const gptResponse = chatCompletion.choices[0].message
            if (typeof (gptResponse.content) !== 'string') {
                throw { name: 'ExternalError' }
            }

            const filteredResponse = gptResponse.content.replace(/\n/g, "")
            const analysis = {};
            const sectionNames = ['KEY TRENDS', 'INSIGHT', 'SUMMARY', 'SUGGESTIONS'];

            sectionNames.forEach((section, index) => {
                const start = filteredResponse.indexOf(section);
                const end = index < sectionNames.length - 1 ? filteredResponse.indexOf(sectionNames[index + 1]) : filteredResponse.length;
                const content = filteredResponse.slice(start + section.length + 1, end).trim();
                analysis[section] = content;
            });

            res.status(200).json({
                KeyTrends: analysis['KEY TRENDS'],
                Insight: analysis['INSIGHT'],
                Summary: analysis['SUMMARY'],
                Suggestions: analysis['SUGGESTIONS']
            })

        } catch (err) {
            next(err)
        }
    }
}
module.exports = ReportsController