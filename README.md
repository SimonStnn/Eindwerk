# Eindwerk

# Idee

Een bluetooth detectie systeem.

## Modules

### Master module

Deze module zal bestaan uit een [Raspberry Pi 3] zonder andere hardware. Deze zal een webserver hebben waar je de rpi kan configureren en gemakkelijk slave modules kan bij toevoegen. De taak van deze module is het detecteren van bluetooth toestellen en deze naar een interne of externe database sturen (MongoDB, prometheus, influxDB of nog andere).

Ook zal deze data ontvangen van een of meerdere slave modules, deze zal hij dus ook moeten ontvangen en verwerken.

Eenmaal deze data verzameld word kan deze gevisualiseerd worden met Grafana.

### Slave module

Deze module bestaat uit een [Arduino uno] die verbonden is met een <ins>bluetooth module [HC-05]</ins>. Deze module dient te kijken welke bluetooth toestellen er zijn en deze om de x aantal seconden door te sturen naar de master module via bluetooth.

## Opties

1. Systeem die alle toestellen met die zichtbaar zijn via bluetooth in een lijst zet en bijhoud op welk tijdstip die gedetecteerd werd. Als je dan te weten komt welk toestel van welke leerling is kun je deze module je aan de ingang van de school plaatsen. Zo kan je zien welke leerlingen te op tijd waren en welke te laat.
2. Je plaatst 3 van deze modules in een kamer en laat deze alle toestellen en deze hun afstand doorsturen naar een hoofdmodule. Deze kan dan berekenen waar in deze driehoek het toestel zich ongeveer bevind, op deze manier kan je je toestel terug vinden als je die verloren hebt.
3. Systeem detecteerd wanneer je in een kamer bent, die vervolgens commando stuurt naar een andere service die het licht zal aan of uit doen.

## Benodigdheden

### Master module

#### Hardware

-  [Raspberry pi 3]

#### Software

- Python script
- Webserver
- Database

### Slave moule

#### Hardware

-  [Arduino uno]
-  [HC-05] bluetooth module

#### Software

- Ardiuno script

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[dill]: https://github.com/joemccann/dillinger
[git-repo-url]: https://github.com/joemccann/dillinger.git
[john gruber]: http://daringfireball.net
[raspberry pi 3]: https://www.google.com/search?q=raspberry+pi+3+&rlz=1C1QPHC_nlBE970BE970&ei=SBc_Y4OKK9D0kgWjuZ_wBg&ved=0ahUKEwiDzqSIl8z6AhVQuqQKHaPcB24Q4dUDCA4&uact=5&oq=raspberry+pi+3+&gs_lcp=Cgdnd3Mtd2l6EAMyBAgAEEMyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6CggAEEcQ1gQQsAM6BggAEB4QBzoHCAAQsQMQQzoLCAAQgAQQsQMQgwFKBAhBGABKBAhGGABQ6hlYwS5gpjtoBXABeACAAbUBiAHhA5IBAzIuMpgBAKABAaABArABAMgBCMABAQ&sclient=gws-wiz&safe=active&ssui=on
[arduino uno]: https://www.google.com/search?q=arduino+uno&rlz=1C1QPHC_nlBE970BE970&ei=Qx0_Y8LjMI_3kgWR7qTwDw&oq=ardui&gs_lcp=Cgdnd3Mtd2l6EAMYATIKCAAQsQMQgwEQQzIKCAAQsQMQgwEQQzIECAAQQzIECAAQQzIECAAQQzIECAAQQzIECAAQQzIKCAAQsQMQgwEQQzIECAAQQzIECAAQQzoKCAAQRxDWBBCwAzoHCAAQsAMQQzoQCC4QsQMQgwEQxwEQ0QMQQzoRCC4QgAQQsQMQgwEQxwEQ0QM6EQguEIAEELEDEMcBENEDENQCOg4ILhCABBCxAxDHARDRAzoOCC4QgAQQsQMQgwEQ1AI6CAgAEIAEELEDSgQIQRgASgQIRhgAUKoJWPwNYPMeaANwAXgAgAFziAGQBJIBAzEuNJgBAKABAcgBCsABAQ&sclient=gws-wiz&safe=active&ssui=on
[hc-05]: https://www.google.com/search?q=arduino+bluetooth+module+hc-05&rlz=1C1QPHC_nlBE970BE970&ei=eh0_Y8SkK8TpsAfz-6SYCA&oq=arduino+bluetooth+module.&gs_lcp=Cgdnd3Mtd2l6EAEYATIGCAAQHhAWMgYIABAeEBYyBggAEB4QFjIGCAAQHhAWMgYIABAeEBYyBggAEB4QFjIGCAAQHhAWMgYIABAeEBYyBggAEB4QFjIGCAAQHhAWOgoIABBHENYEELADOgcIABCwAxBDOgoIABCxAxCDARBDOgQIABBDOgUIABCABDoLCAAQgAQQsQMQgwFKBAhBGABKBAhGGABQ4gdYiiNg-zVoAXABeACAAXKIAd8DkgEDMy4ymAEAoAEByAEKwAEB&sclient=gws-wiz&safe=active&ssui=on
