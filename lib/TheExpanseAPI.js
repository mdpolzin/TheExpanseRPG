on("chat:message", function(msg) {
    if (msg.type !== "api" ) return

    let args = msg.content.split('|||')

    log(msg)

    if (args.shift() === '!theexpanse' && args.length) {
        let response = ""
        try  {
            let subtype = args.shift()
            if (subtype === 'damage' && args.length === 5) {
                let name = args.shift()
                let dice = args.shift()
                let attribute = args.shift()
                let dmg_bonus = parseInt(eval(args.shift()))
                let modifiers = parseInt(eval(args.shift()))

                dice = []
                msg.inlinerolls[0].results.rolls[0].results.forEach((result) => {
                    dice.push(result.v)
                })

                let total = msg.inlinerolls[0].results.total
                let total_modifiers = dmg_bonus + modifiers

                let table_format = "!power {{" +
                " --name|" + name +
                " --!Output|~C[TTB width='100%' bgcolor='White'][TRB]"

                    dice.forEach((die, idx) => {
                        table_format += "[TDB]" + die + "~~~<small>Die " + (idx + 1) + "</small>[TDE]"
                    })
                    table_format += "[TRE]" +
                    "[TRB][TDB colspan='3']Modifiers: " + total_modifiers + "[TDE][TRE]"
                table_format += "[TRB][TDB colspan='3']Damage: " + (total + total_modifiers) + "[TDE][TRE]" +
                "[TTE]~C"

                response = table_format
            }
            else if (subtype === 'test' && args.length === 7) {
                let name = args.shift()
                let dice = args.shift()
                let attribute = args.shift()
                let attr_val = parseInt(eval(args.shift()))
                let focus_val = parseInt(eval(args.shift()))
                let modifiers = parseInt(eval(args.shift()))
                let tn = args.shift()

                let first_die = msg.inlinerolls[0].results.rolls[0].results[0].v
                let second_die = msg.inlinerolls[0].results.rolls[0].results[1].v
                let drama_die = msg.inlinerolls[0].results.rolls[0].results[2].v
                let total = msg.inlinerolls[0].results.total
                let sp = 0

                if (first_die === second_die && second_die === drama_die) sp = drama_die * 2
                else if (first_die === second_die || second_die === drama_die || first_die === drama_die) sp = drama_die

                let total_modifiers = attr_val + focus_val + modifiers

                let table_format = "!power {{" +
                " --name|" + name +
                " --!Output|~C[TTB width='100%' bgcolor='White']" +
                    "[TRB][TDB colspan='3']" + attribute + "[TDE][TRE]" +
                    "[TRB][TDB]" + first_die + "~~~<small>First Die</small>[TDE][TDB]" + second_die + "~~~<small>Second Die</small>[TDE][TDB bgcolor='#ddd']" + drama_die + "~~~<small>Drama Die</small>[TDE][TRE]" +
                    "[TRB][TDB colspan='3']Modifiers: " + total_modifiers + "[TDE][TRE]"
                if (sp) table_format += "[TRB][TDB bgcolor='#ddd' colspan='3']Stunt Points: " + sp + "[TDE][TRE]"
                table_format += "[TRB][TDB colspan='3']Result: " + (total + total_modifiers) + " vs. " + tn + "[TDE][TRE]" +
                "[TTE]~C"

                response = table_format
            }
        } catch (err) {
            response = "An error ocurred: " + err.message
        } finally {
            setTimeout(() => {sendChat(msg.who, response)}, 500)
        }
    }
})
