# QRCode -> vCard -> Usable CSV

I was recently at QCon London and the team captured a number of attendee details via QRCode readers. This gives you the full attendee detail in a vCard (vcf). At the end of the day you can then export those captures to CSV. However, you end up getting a CSV with 3 rows e.g.

```
Name, Text, Date
"vCard Contact","BEGIN:VCARD
N:Some Name
ORG:Some Org
TITLE:Some Job Title
TEL:555 555 555
ADR;TYPE=WORK:;;Some Address
EMAIL:Soem Email
NOTE:Contact from QCon London 2014
END:VCARD
",05/03/2014
...
```

This little hack takes all the exported .csv files form the `data` folder and creates a `results.csv` in the `results` folder which can be imported into Mail Chimp.

Maybe it'll be useful to others.

## Usage

1. Put your QRCode vCard capture .csv files in `data`
2. Run `node index.js`
3. Upload the `data/results.csv` file into Mail Chimp or similar

## TODO

The code sucks! But it works.

* Refactor<sup>†</sup>
* Add tests†<sup>†</sup>

<sup>†</sup> only if anybody ever uses this again
