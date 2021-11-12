module.exports = {
    name: "boyes",
    description: "retrieve the lore of a follow boye",
    execute(message) {
        if (message.content.includes(`${process.env.prefix}daniel`)) boye_daniel(message);
        else if (message.content.includes(`${process.env.prefix}daan`)) boye_daan(message);
        else if (message.content.includes(`${process.env.prefix}julian`)) boye_julian(message);
        else if (message.content.includes(`${process.env.prefix}ramon`)) boye_ramon(message);
        else if (message.content.includes(`${process.env.prefix}boyes`)) boyes(message);
    }
}

const boye_daniel = (message) => {
    message.channel.send({content: 'Womanizer is niet de enige waar deze man bekend om staat. De man draagt dan ook de verantwoordelijkheid om zijn stad tegen de vele gevaren te beschermen. Healers zijn in deze tijden van corona erg schaars maar dit is geen issue voor de boyes. Ook hechtingen verwijderen is voor Daniel dan ook geen uitdagende klus en doet dit gerust met een glaasje whisky.', files: ['./images/danielframe.gif']});
}

const boye_daan = (message) => {
    message.channel.send({content: 'Ongelofelijk. Dit gaat niet over hoe ongelofelijk lekker hij is, maar elke keer dat de boyes weer iets in hun schild uitvoeren is dit wat er in zijn heerlijke koppie omgaat. De tank die elke party nodig heeft en de man waar elke boye achter mag staan. Heren, Dak van de markt of mangos. Geen enkele feest is gevaar met deze tank in hun nabijheid. ', files: ['./images/daanframe.gif']});
}

const boye_julian = (message) => {
    message.channel.send({content: 'Julian wil graag de wereld veroveren, maar wat hij echt veroverd zijn de harten van de boyes. Holy moly denken ze dan, als deze heerlijke jongen weer om een Elton John vraagt. Aftrekken op het balkon is hij dan ook niet vies van.', files: ['./images/julianframe.gif']});
}

const boye_ramon = (message) => {
    message.channel.send({ content: 'Ramon is van nature al edgy en heeft dus geen edgy class nodig om de wereld te laten zien hoe edgy hij is. Van zijn geluk lijkt nog veel te blijven, al beseft hij niet hoeveel geluk hij heeft dat hij met 1 luck onderdeel mag uitmaken van de boyes.', files: ['./images/ramonframe.gif']});
}

const boyes = (message) => {
     message.channel.send('!daan')
     message.channel.send('!daniel')
     message.channel.send('!julian')
     message.channel.send('!ramon')
}