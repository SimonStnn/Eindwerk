# Eindwerk

# Idee

Een bluetooth detectie systeem.

## Modules

### Master module

Deze module zal bestaan uit een [Raspberry Pi 3] samen met een [7-segment display] die het aantal beschikbare bluetooth apparaten zal weergeven. Daarnaast heb je ook een [LCD scherm] die een naam van een beschikbaar toestel weergeeft, naast deze display heb je 2 [knop]pen die dienen om het volgende beschikbare toestel op de display te zetten.<br>
Deze zal een webserver hebben waar je de rpi kan configureren en gemakkelijk slave modules kan toevoegen. De taak van deze module is het detecteren van bluetooth toestellen en deze naar een interne of externe database sturen (MongoDB, prometheus, influxDB of nog andere).

Ook zal deze data ontvangen van een of meerdere slave modules, deze zal hij dus ook moeten ontvangen en verwerken.

Eenmaal deze data verzameld word kan deze gevisualiseerd worden met Grafana.

### Slave module

Deze module bestaat uit een [Arduino uno] die verbonden is met een bluetooth module [HC-05]. Deze module dient te kijken welke bluetooth toestellen er zijn en deze om de x aantal seconden door te sturen naar de master module via bluetooth.

## Opties

1. Systeem die alle toestellen met die zichtbaar zijn via bluetooth in een lijst zet en bijhoud op welk tijdstip die gedetecteerd werd. Als je dan te weten komt welk toestel van welke leerling is kun je deze module je aan de ingang van de school plaatsen. Zo kan je zien welke leerlingen te op tijd waren en welke te laat.
2. Je plaatst 3 van deze modules in een kamer en laat deze alle toestellen en deze hun afstand doorsturen naar een hoofdmodule. Deze kan dan berekenen waar in deze driehoek het toestel zich ongeveer bevind, op deze manier kan je je toestel terugvinden als je die verloren hebt.<br>
![Toestel localiseren](consept/Device_Localiseren.png)<br>
In bovenstaande foto zie je 3 modules die elk hetzelfde toestel zien samen met de afstand van de module, dus ze weten het toestel ligt ergens op de licht groene circel, de master module krijgt van de 2 andere modules de afstand binnen dat het toestel van de slave modules verwijderd is. Zo kan de master module berekenen waar het toestel zicht werkelijk bevind.
3. Systeem detecteerd wanneer je in een kamer bent, die vervolgens commando stuurt naar een home assistent die het licht zal aan of uit doen.

# Benodigdheden

## Master module

### Hardware

-  #### [Raspberry pi 3]<br>
   Deze is het centrum van alles wat gebeurt.
-  #### [7-segment display]<br>
   Hiervan zullen er 2 naast elkaar staan, zodat je cijfers kan weergeven met 2 decimalen. Deze geven het aantal gevonden toestellen weer.
-  #### [LCD scherm]<br>
   Dit scherm geeft de namen of addressen van de toestellen weer die hij gevonden heeft. De afgebeelde addressen zullen automatisch veranderen. Om de x aantal seconden zal het volgende toestel afgebeeld worden.
-  #### 2 [knop]pen<br>
   Door deze knoppen in te drukken zal het vorige of volgende gevonden toestel weergegeven worden op het [LCD scherm].

#### Software

-  #### Python script<br>
   Dit script zal alle data verwerken en berekeningen maken.
-  #### Webserver<br>
   Hierop zijn grafieken te zien, samen met een platte grond van de ruimte waar de modules zich gevinden. In deze platte grond zijn alle gevonden toestellen te zien, waar ze zich bevinden in de ruimte.<br>
   Op een tweede pagina kun je het programma configureren(bv. het interval waarin de modules zullen scannen naar nieuwe toestellen).
-  #### Database<br>
   Hier word alle data opgeslagen over de gevonden toestellen:
   -  Naam;
   -  Address;
   -  Positie;
      -  x;
      -  y;
   -  (Posities van alle modules.)
-  #### Home assistent<br>
   Wanneer de master module een commando stuurt naar een homeassistent (zal bv. het licht van de kamer aan gaan).<br>
   Er word een commando verstuurd als de module een toestel herkent en deze zich in de kamer bevind.

## Slave moule

### Hardware

-  #### [Arduino uno]<br>
   Bestuurt de [HC-05]. 
-  #### [HC-05] bluetooth module<br>
   Scant voor beschikbare toestellen.

### Software

-  Ardiuno script<br>
   Laat de [HC-05] scannen voor beschikbare toestellen, om hierna de gevonden toestellen door te sturen naar de master module.

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"

<!-- Raspberry pi -->

[raspberry pi 3]: https://www.raspberrypi.com/products/raspberry-pi-3-model-b/

<!-- Arduino -->

[arduino uno]: https://store.arduino.cc/products/arduino-uno-rev3

<!-- Bluetooth module -->

[hc-05]: https://components101.com/wireless/hc-05-bluetooth-module

<!-- 7-segment display -->

[7-segment display]: https://www.otronic.nl/a-65446199/segment-led-displays/7-segment-led-display-rood-0-56-inch/

<!-- LCD scherm -->

[lcd scherm]: https://www.google.com/search?q=LCD+scherm&rlz=1C1QPHC_nlBE970BE970&oq=LCD+scherm&aqs=chrome..69i57j0i512l9.3309j0j7&sourceid=chrome&ie=UTF-8&safe=active&ssui=on

 <!-- Button -->

[knop]: https://www.otronic.nl/a-60343296/schakelaars/drukknopje-moment-6x6x4/
