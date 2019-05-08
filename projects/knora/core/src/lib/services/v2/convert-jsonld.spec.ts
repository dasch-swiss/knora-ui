import { async } from '@angular/core/testing';
import {
    CountQueryResult,
    ReadBooleanValue,
    ReadColorValue,
    ReadDateValue,
    ReadDecimalValue,
    ReadIntegerValue,
    ReadIntervalValue,
    ReadLinkValue,
    ReadListValue,
    ReadProperties,
    ReadResource,
    ReadResourcesSequence,
    ReadStillImageFileValue,
    ReadTextFileValue,
    ReadTextValueAsHtml,
    ReadTextValueAsString,
    ReadTextValueAsXml,
    ReadUriValue
} from '../../declarations';
import { ConvertJSONLD } from './convert-jsonld';

describe('ConvertJSONLD', () => {
    /**
     * The following tests use async() because the JSON-LD processor is involved.
     * The data to check for are inside a Promise.
     * See https://angular.io/guide/testing#component-with-async-service
     */

    it('parse a JSON-LD document representing letter 176-O', async(() => {
        const jsonld = require('jsonld');

        // http://api.02.unibas.dasch.swiss/v2/resources/http%3A%2F%2Frdfh.ch%2F0801%2Fbeol%2F-0tI3HXgSSOeDtkf-SA00w
        const EulerLetter: any = require('../../test-data/resources/EulerLetter_176-O.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(EulerLetter, {});

        promise.then(compacted => {
            const expectedProps: ReadProperties = {
                'http://0.0.0.0:3333/ontology/0801/beol/v2#creationDate': [
                    new ReadDateValue(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/hg4D_yctTweaZ9vtCkDqnw',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#creationDate',
                        'GREGORIAN',
                        1756,
                        1756,
                        'CE',
                        'CE',
                        1,
                        1,
                        3,
                        3
                    )
                ],
                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasAuthorValue': [
                    new ReadLinkValue(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/dt3rgRFjTh-bG_kJPdV2Eg',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasAuthorValue',
                        'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw',
                        new ReadResource(
                            'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw',
                            'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                            'Leonhard Euler',
                            [],
                            [],
                            [],
                            [],
                            {}
                        )
                    )
                ],
                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasRecipientValue': [
                    new ReadLinkValue(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/2YYzj2uGTzeaKze3vScqRA',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasRecipientValue',
                        'http://rdfh.ch/0802/shubb5TjTnu84MqkM6uHlA',
                        new ReadResource(
                            'http://rdfh.ch/0802/shubb5TjTnu84MqkM6uHlA',
                            'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                            'Christian Goldbach',
                            [],
                            [],
                            [],
                            [],
                            {}
                        )
                    )
                ],
                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSubject': [
                    new ReadListValue(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/eoyTM9yqT3maAV704FNZoQ',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSubject',
                        'http://rdfh.ch/lists/0801/other_quadratic_forms',
                        'Other quadratic forms'
                    ),
                    new ReadListValue(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/wKbQ86WkRtSOyQomLN3-GA',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSubject',
                        'http://rdfh.ch/lists/0801/berlin_academy',
                        'Berlin Academy'
                    ),
                    new ReadListValue(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/NvANUAjVQXusdezLDIHlNg',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSubject',
                        'http://rdfh.ch/lists/0801/other_professional_tasks',
                        'Other professional tasks'
                    ),
                    new ReadListValue(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/q67xf4J3RKe4Y_wNYyVanQ',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSubject',
                        'http://rdfh.ch/lists/0801/errands',
                        'Errands'
                    ),
                    new ReadListValue(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/PePWR2aVSueUZAvryhM8RQ',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSubject',
                        'http://rdfh.ch/lists/0801/book_trade_orders',
                        'Book trade, orders'
                    ),
                    new ReadListValue(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/NoeWmFy1TVyA0CGDTPVCsA',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSubject',
                        'http://rdfh.ch/lists/0801/johann_albrecht_euler',
                        'Johann Albrecht Euler'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0801/beol/v2#letterHasLanguage': [
                    new ReadTextValueAsString(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/I6jR1ifGQ8uy1BIT3mhgvw',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#letterHasLanguage',
                        'German'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasText': [
                    new ReadTextValueAsHtml(
                        'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg/values/vnfi65mrQBue7OmI5wonvA',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasText',
                        '<div>\n   <div id="transcription">\n      \n      <p>Hochwohlgebohrner Herr</p>\n      \n      <p>Hochgeehrtester Herr <em>Etats</em> Rath\n      </p>\n      \n      <p>Bey dem Antritt dieses neuen Jahrs lege ich zuvorderst meinen herzlichsten Wunsch\n         für das beständige Wohlseyn Eur. Hochwohlgeb. ab, und empfehle mich dabey gehorsamst\n         sammt den meinigen zu Dero fortdaurenden Wohlgewogenheit<span class="math">\\(\\,.\\,\\)</span> Zugleich statte ich auch Eur. Hochwohlgeb. meine verpflichtetste Danksagung ab für\n         den gütigen Antheil welchen Dieselben an unserem Zustand zu nehmen belieben und habe\n         das Vergnügen Eur. Hochwohlgeb. zu berichten, daß&nbsp;S[ein]<span class="math">\\(\\,{}^{\\text{e}}\\,\\)</span> Königl[iche] <em>Majestät<a class="person salsah-link" href="http://rdfh.ch/0802/BqZGx2KmRS2mIMK_DUxapg"></a></em> bey dem Anfang dieses Jahrs Dero Pathen unsern ältesten Sohn mit einer jährlichen\n         Besoldung von <a class="person salsah-link" href="http://rdfh.ch/0802/shgx0f71R66N_noFNc3gkg"></a><span class="math">\\(\\,200\\,\\)</span> Rthl. begnadiget.<a class="salsah-link" href="http://rdfh.ch/0801/KPOPzTVLSdyxiScitUAyTQ"><sup>1</sup></a></p>\n      \n      <p>Ich habe nun schon eine geraume Zeit so viel andere Geschäfte gehabt daß&nbsp;ich an <em>numeri</em>sche <em>Theoremata</em>, dergleichen ich Eur. Hochwohlgeb. das letste mal vorzulegen die Ehre gehabt, nicht\n         habe denken können. Die <em>Partes Matheseos applicatae</em> nehmen mir die meiste Zeit weg, wo es immer mehr zu untersuchen gibt, je mehr man\n         damit umgeht.<a class="salsah-link" href="http://rdfh.ch/0801/0m02gFutQ7yEt559a2uOlg"><sup>2</sup></a></p>\n      \n      <p>Weil nun mein Kopf mit so viel anderen Sachen angefüllet ist, so mag das wohl die\n         Ursache seyn, daß&nbsp;ich mich in das von Eur. Hochwohlgeb. <em>communicir</em>te und nach der Hand verbesserte <em>Theorema</em> nicht finden kan. Vielleicht haben Eur. Hochwohlgeb. vergessen noch eine wesentliche\n         <em>Condition</em> hinzuzusetzen.<a class="salsah-link" href="http://rdfh.ch/0801/_vmiVEfoSw-BA2_Ppz2nPQ"><sup>3</sup></a></p>\n      \n      <p>Das <em>Theorema</em> war: <em>Si sit</em><span class="math">\\(\\,aa+bb=P^{2}+eQ^{2}\\,\\)</span><em>erit etiam</em></p>\n      \n      <p>\n         <span class="math">\\(\\,a^{2}+\\left(\\left(2e+1\\right)b-eP-eQ\\right)^{2}=M^{2}+eN^{2}\\text{;}\\,\\)</span>\n         \n      </p>\n      \n      <p>weil ich den Grund desselben nicht einsehen konnte, so habe ich die Richtigkeit desselben\n         durch <em>Exempel</em> erforschen wollen.\n      </p>\n      \n      <p>I. Da <span class="math">\\(\\,1^{2}+4^{2}=17=3^{2}+2\\cdot 2^{2}\\,\\)</span>, so ist <span class="math">\\(\\,a=1\\,\\)</span>, <span class="math">\\(\\,b=4\\,\\)</span>, <span class="math">\\(\\,P=3\\,\\)</span>, <span class="math">\\(\\,Q=2\\,\\)</span> und <span class="math">\\(\\,e=2\\,\\)</span>, allso müste seyn\n      </p>\n      \n      <p>\n         <span class="math">\\(\\,1^{2}+\\left(5\\cdot 4-2\\cdot 3-2\\cdot 2\\right)^{2}=1^{2}+10^{2}=101=M^{2}+2N^{2}\\,\\)</span>\n         \n      </p>\n      \n      <p>welches unmöglich ist.</p>\n      \n      <p>II. Da <span class="math">\\(\\,9^{2}+4^{2}=97=7^{2}+3\\cdot 4^{2}\\,\\)</span>, so ist <span class="math">\\(\\,a=9\\,\\)</span>; <span class="math">\\(\\,b=4\\,\\)</span>; <span class="math">\\(\\,P=7\\,\\)</span>; <span class="math">\\(\\,Q=4\\,\\)</span> und <span class="math">\\(\\,e=3\\,\\)</span>, allso müsste seyn\n      </p>\n      \n      <p>\n         <span class="math">\\(\\,9^{2}+\\left(7\\cdot 4-3\\cdot 7-3\\cdot 4\\right)^{2}=9^{2}+5^{2}=106=M^{2}+3N^{2}\\,\\)</span>\n         \n      </p>\n      \n      <p>welches ebenfalls unmöglich ist.</p>\n      \n      <p>Da ich nun nicht einmal ein <em>Exempel</em> finden kan, welches einträfe, so schliesse ich daraus, daß&nbsp;eine gewisse Bedingung\n         in den Zahlen <span class="math">\\(\\,a\\,\\)</span>, <span class="math">\\(\\,b\\,\\)</span>, <span class="math">\\(\\,P\\,\\)</span> und <span class="math">\\(\\,Q\\,\\)</span> müsse weggelassen seyn, welche ich aber nicht ausfündig machen kan.<a class="salsah-link" href="http://rdfh.ch/0801/sd6JbWUlTvig8vWIqZy6-Q"><sup>4</sup></a></p>\n      \n      <p>Ich habe dem H. <em>Spener<a class="person salsah-link" href="http://rdfh.ch/0802/CKzU513NSWyVhwe0gpbMWg"></a></em> zu wissen gethan, daß&nbsp;Eur. Hochwohlgeb. die Rechnung für die überschickten Bücher\n         verlangen; bekomme ich dieselbe vor Schliessung dieses Briefs, wie ich ihm habe sagen\n         lassen, so werde ich sie beylegen.<a class="salsah-link" href="http://rdfh.ch/0801/f-2Ta0NRSBikdqXivSLuMw"><sup>5</sup></a></p>\n      \n      <p>Sonsten da er nicht alle verlangte Bücher gehabt, so werde ich inskünftige dergleichen\n         <em>Commission</em>en dem <em>M.<span class="math">\\(\\,{}^{\\text{r}}\\,\\)</span>Neaulme<a class="person salsah-link" href="http://rdfh.ch/0802/UWsNivv1R46modSygvjOLA"></a></em>, welcher weit <em>activer</em> ist und alles schaffen kan, auftragen. Wegen des Werks: <em>La Clef du Cabinet des Princes<a class="person salsah-link" href="http://rdfh.ch/0802/Hju9FefOQ5KgnXUHnYqUVA"></a><a class="item salsah-link" href="http://rdfh.ch/0802/iJK4gffNTW-18RsNf8JLbA"></a></em> füge hier die Antwort des <em>M.<span class="math">\\(\\,{}^{\\text{r}}\\,\\)</span>de Bourdeaux<a class="person salsah-link" href="http://rdfh.ch/0802/6dLVf6BjRPCmndIwhFZLEw"></a></em> bey.<a class="salsah-link" href="http://rdfh.ch/0801/2BZx-h5vTcCXaqxaSXjoXA"><sup>6</sup></a></p>\n      \n      <p>Sollte dasselbe vor der Ankunft einer <em>Resolution</em> von Eur. Hochwohlgeb. schon verkauft worden seyn, so hat sich <em>M.<span class="math">\\(\\,{}^{\\text{r}}\\,\\)</span></em><em>Neaulme<a class="person salsah-link" href="http://rdfh.ch/0802/UWsNivv1R46modSygvjOLA"></a></em> anheischig gemacht, dasselbe auch zu liefern.\n      </p>\n      \n      <p>Ich habe die Ehre mit der schuldigsten Hochachtung zu verharren</p>\n      \n      <p>Eur. Hochwohlgebohrnen</p>\n      \n      <p>gehorsamster Diener</p>\n      \n      <p>\n         <em>L. Euler</em>\n         \n      </p>\n      \n      <p><em>Berlin</em> den 3<span class="math">\\(\\,{}^{\\text{ten}}\\,\\)</span><em>Januarii</em></p>\n      \n      <p>1756.</p>\n      \n      <p>\n         <sub>Berlin, January 3rd, 1756</sub>\n         \n      </p>\n      \n      <p>\n         <sub>Original, 1 fol. – RGADA, f. 181, n. 1413, č. V, fol. 123rv</sub>\n         \n      </p>\n      \n      <p>\n         <sub>Published: <em>Correspondance</em> (1843), t. I, p. 636–637; <em>Euler-Goldbach</em> (1965), p. 385–386</sub>\n         \n      </p>\n      \n   </div>\n   <div id="references">\n      <ol></ol>\n   </div>\n</div>',
                        {
                            'http://rdfh.ch/0801/f-2Ta0NRSBikdqXivSLuMw': new ReadResource(
                                'http://rdfh.ch/0801/f-2Ta0NRSBikdqXivSLuMw',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#endnote',
                                'L176 note-5',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0801/_vmiVEfoSw-BA2_Ppz2nPQ': new ReadResource(
                                'http://rdfh.ch/0801/_vmiVEfoSw-BA2_Ppz2nPQ',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#endnote',
                                'L176 note-3',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0801/0m02gFutQ7yEt559a2uOlg': new ReadResource(
                                'http://rdfh.ch/0801/0m02gFutQ7yEt559a2uOlg',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#endnote',
                                'L176 note-2',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0801/sd6JbWUlTvig8vWIqZy6-Q': new ReadResource(
                                'http://rdfh.ch/0801/sd6JbWUlTvig8vWIqZy6-Q',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#endnote',
                                'L176 note-4',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0801/2BZx-h5vTcCXaqxaSXjoXA': new ReadResource(
                                'http://rdfh.ch/0801/2BZx-h5vTcCXaqxaSXjoXA',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#endnote',
                                'L176 note-6',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0801/KPOPzTVLSdyxiScitUAyTQ': new ReadResource(
                                'http://rdfh.ch/0801/KPOPzTVLSdyxiScitUAyTQ',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#endnote',
                                'L176 note-1',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0802/BqZGx2KmRS2mIMK_DUxapg': new ReadResource(
                                'http://rdfh.ch/0802/BqZGx2KmRS2mIMK_DUxapg',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                                'Friedrich II.',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0802/UWsNivv1R46modSygvjOLA': new ReadResource(
                                'http://rdfh.ch/0802/UWsNivv1R46modSygvjOLA',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                                'Jean Neaulme',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0802/CKzU513NSWyVhwe0gpbMWg': new ReadResource(
                                'http://rdfh.ch/0802/CKzU513NSWyVhwe0gpbMWg',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                                'Johann Carl (the Elder) Spener',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0802/shgx0f71R66N_noFNc3gkg': new ReadResource(
                                'http://rdfh.ch/0802/shgx0f71R66N_noFNc3gkg',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                                'Johann Albrecht Euler',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0802/iJK4gffNTW-18RsNf8JLbA': new ReadResource(
                                'http://rdfh.ch/0802/iJK4gffNTW-18RsNf8JLbA',
                                'http://0.0.0.0:3333/ontology/0802/biblio/v2#Book',
                                'Jordancl 1704',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0802/Hju9FefOQ5KgnXUHnYqUVA': new ReadResource(
                                'http://rdfh.ch/0802/Hju9FefOQ5KgnXUHnYqUVA',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                                'Claude Jordan',
                                [],
                                [],
                                [],
                                [],
                                {}
                            ),
                            'http://rdfh.ch/0802/6dLVf6BjRPCmndIwhFZLEw': new ReadResource(
                                'http://rdfh.ch/0802/6dLVf6BjRPCmndIwhFZLEw',
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                                'Etienne de Bourdeaux',
                                [],
                                [],
                                [],
                                [],
                                {}
                            )
                        }
                    )
                ]
            };

            const EulerLetterResourceExpected = new ReadResource(
                'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#letter',
                'L176 Original',
                [],
                [],
                [],
                [],
                expectedProps
            );

            const EulerLetterResourceExpectedWithMetadata = new ReadResource(
                'http://rdfh.ch/0801/j4BrggcKS0CltUf1Ssl9Jg',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#letter',
                'L176 Original',
                [],
                [],
                [],
                [],
                expectedProps,
                {
                    ark:
                        'http://0.0.0.0:3336/ark:/72163/1/0801/j4BrggcKS0CltUf1Ssl9Jg',
                    user: 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE',
                    creation: '2018-08-27T17:43:04.192Z',
                    lastModification: undefined,
                    permissions:
                        'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser|RV knora-base:UnknownUser'
                }
            );

            const receivedResource: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(
                compacted
            );

            expect(receivedResource.numberOfResources).toEqual(1);

            expect(receivedResource.resources[0].id).toEqual(
                EulerLetterResourceExpected.id
            );

            expect(receivedResource.resources[0].type).toEqual(
                EulerLetterResourceExpected.type
            );

            expect(receivedResource.resources[0].label).toEqual(
                EulerLetterResourceExpected.label
            );

            expect(receivedResource.resources[0].metadata).toEqual(undefined);

            expect(
                receivedResource.resources[0].properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#creationDate'
                ]
            ).toEqual(
                EulerLetterResourceExpected.properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#creationDate'
                ]
            );

            expect(
                receivedResource.resources[0].properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#hasAuthorValue'
                ]
            ).toEqual(
                EulerLetterResourceExpected.properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#hasAuthorValue'
                ]
            );

            expect(
                receivedResource.resources[0].properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#hasRecipientValue'
                ]
            ).toEqual(
                EulerLetterResourceExpected.properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#hasRecipientValue'
                ]
            );

            expect(
                receivedResource.resources[0].properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSubject'
                ]
            ).toEqual(
                EulerLetterResourceExpected.properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSubject'
                ]
            );

            expect(
                receivedResource.resources[0].properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#letterHasLanguage'
                ]
            ).toEqual(
                EulerLetterResourceExpected.properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#letterHasLanguage'
                ]
            );

            expect(
                receivedResource.resources[0].properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#hasText'
                ]
            ).toEqual(
                EulerLetterResourceExpected.properties[
                    'http://0.0.0.0:3333/ontology/0801/beol/v2#hasText'
                ]
            );

            const receivedResourceMWithMetadata: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(
                compacted,
                true
            );
            expect(receivedResourceMWithMetadata.numberOfResources).toEqual(1);

            expect(
                receivedResourceMWithMetadata.resources[0].metadata.ark
            ).toEqual(EulerLetterResourceExpectedWithMetadata.metadata.ark);
            expect(
                receivedResourceMWithMetadata.resources[0].metadata.user
            ).toEqual(EulerLetterResourceExpectedWithMetadata.metadata.user);
            expect(
                receivedResourceMWithMetadata.resources[0].metadata.creation
            ).toEqual(
                EulerLetterResourceExpectedWithMetadata.metadata.creation
            );
            expect(
                receivedResourceMWithMetadata.resources[0].metadata
                    .lastModification
            ).toEqual(
                EulerLetterResourceExpectedWithMetadata.metadata
                    .lastModification
            );
            expect(
                receivedResourceMWithMetadata.resources[0].metadata.permissions
            ).toEqual(
                EulerLetterResourceExpectedWithMetadata.metadata.permissions
            );
        });
    }));

    it('parse a JSON-LD document representing a thing', async(() => {
        const jsonld = require('jsonld');

        // http://localhost:3333/v2/resources/http%3A%2F%2Frdfh.ch%2F0001%2FH6gBWUuJSuuO-CilHV8kQw
        const thing: any = require('../../test-data/resources/Testthing.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(thing, {});

        promise.then(compacted => {
            const receivedResource: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(
                compacted
            );

            expect(receivedResource.numberOfResources).toEqual(1);

            const expectedProps: ReadProperties = {
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean': [
                    new ReadBooleanValue(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/IN4R19yYR0ygi3K2VEHpUQ',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean',
                        true
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor': [
                    new ReadColorValue(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/TAziKNP8QxuyhC4Qf9-b6w',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor',
                        '#ff3333'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate': [
                    new ReadDateValue(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/-rG4F5FTTu2iB5mTBPVn5Q',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate',
                        'GREGORIAN',
                        2018,
                        2018,
                        'CE',
                        'CE',
                        5,
                        5,
                        13,
                        13
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal': [
                    new ReadDecimalValue(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/bXMwnrHvQH2DMjOFrGmNzg',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal',
                        1.5
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger': [
                    new ReadIntegerValue(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/dJ1ES8QTQNepFKF5-EAqdg',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger',
                        1
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval': [
                    new ReadIntervalValue(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/RbDKPKHWTC-0lkRKae-E6A',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval',
                        0,
                        216000
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem': [
                    new ReadListValue(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/XAhEeE3kSVqM4JPGdLt4Ew',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem',
                        'http://rdfh.ch/lists/0001/treeList01',
                        'Tree list node 01'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherListItem': [
                    new ReadListValue(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/j8VQjbD0RsyxpyuvfFJCDA',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherListItem',
                        'http://rdfh.ch/lists/0001/otherTreeList01',
                        'Other Tree list node 01'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue': [
                    new ReadLinkValue(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/uvRVxzL1RD-t9VIQ1TpfUw',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue',
                        'http://rdfh.ch/0001/0C-0L1kORryKzJAJxxRyRQ',
                        new ReadResource(
                            'http://rdfh.ch/0001/0C-0L1kORryKzJAJxxRyRQ',
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing',
                            'Sierra',
                            [],
                            [],
                            [],
                            [],
                            {}
                        )
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext': [
                    new ReadTextValueAsXml(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/rvB4eQ5MTF-Qxq0YgkwaDg',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext',
                        '<?xml version="1.0" encoding="UTF-8"?>\n<text><p>test with <strong>markup</strong></p></text>',
                        'http://rdfh.ch/standoff/mappings/StandardMapping'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText': [
                    new ReadTextValueAsString(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/SZyeLLmOTcCCuS3B0VksHQ',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText',
                        'test'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri': [
                    new ReadUriValue(
                        'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/uBAmWuRhR-eo1u1eP7qqNg',
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri',
                        'http://www.google.ch'
                    )
                ]
            };

            const ThingResourceExpected = new ReadResource(
                'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw',
                'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing',
                'testding',
                [],
                [],
                [],
                [],
                expectedProps
            );

            expect(receivedResource.resources[0]).toEqual(
                ThingResourceExpected
            );
        });
    }));

    it('parse a JSON-LD document representing a list of resources', async(() => {
        const jsonld = require('jsonld');

        // http://localhost:3333/v2/search/Narr?limitToProject=http%3A%2F%2Frdfh.ch%2Fprojects%2F0803
        const resultsForEuler: any = require('../../test-data/resources/SearchResultNarr.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(resultsForEuler, {});

        promise.then(compacted => {
            const receivedResource: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(
                compacted
            );

            expect(receivedResource.numberOfResources).toEqual(25);

            expect(receivedResource.resources.length).toEqual(25);
        });
    }));

    it('parse a JSON-LD document representing a book with incoming pages containing the source as a value object', async(() => {
        const jsonld = require('jsonld');

        // see Knora: webapi/src/test/resources/test-data/searchR2RV2/bookWithIncomingPagesOnlyLink.jsonld
        const resultsForBookWithIncomingLink: any = require('../../test-data/resources/BookWithIncomingPages.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(resultsForBookWithIncomingLink, {});

        promise.then(compacted => {
            const receivedResource: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(
                compacted
            );

            expect(receivedResource.numberOfResources).toEqual(1);

            const expectedProps: ReadProperties = {
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#title': [
                    new ReadTextValueAsString(
                        'http://rdfh.ch/0803/8be1b7cf7103/values/463b6498b70d',
                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#title',
                        '[Das] Narrenschiff (lat.)'
                    ),
                    new ReadTextValueAsString(
                        'http://rdfh.ch/0803/8be1b7cf7103/values/0965b7d1b70d',
                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#title',
                        'Stultifera navis (...)'
                    )
                ],
                'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue': [
                    new ReadLinkValue(
                        'http://rdfh.ch/0803/50e7460a7203/values/8bdc04c8-b765-44c8-adb3-5ab536dcd051',
                        'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue',
                        'http://rdfh.ch/0803/50e7460a7203',
                        new ReadResource(
                            'http://rdfh.ch/0803/50e7460a7203',
                            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#page',
                            'vorderer Spiegel',
                            [],
                            [],
                            [],
                            [],
                            {
                                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#partOfValue': [
                                    new ReadLinkValue(
                                        'http://rdfh.ch/0803/50e7460a7203/values/8bdc04c8-b765-44c8-adb3-5ab536dcd051',
                                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#partOfValue',
                                        'http://rdfh.ch/0803/8be1b7cf7103'
                                    )
                                ]
                            }
                        )
                    )
                ]
            };

            const BookResourceWithIncomingExpected = new ReadResource(
                'http://rdfh.ch/0803/8be1b7cf7103',
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book',
                '[Das] Narrenschiff (lat.)',
                [],
                [],
                [],
                [],
                expectedProps
            );

            expect(receivedResource.resources[0]).toEqual(
                BookResourceWithIncomingExpected
            );
        });
    }));

    it('parse a JSON-LD document representing a book with incoming pages referring to the source via its Iri', async(() => {
        const jsonld = require('jsonld');

        // see Knora: webapi/src/test/resources/test-data/searchR2RV2/bookWithIncomingPagesOnlyLink.jsonld
        // not that the source is represented as an Iri only
        const resultsForBookWithIncomingLink: any = require('../../test-data/resources/BookWithIncomingPages2.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(resultsForBookWithIncomingLink, {});

        promise.then(compacted => {
            const receivedResource: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(
                compacted
            );

            expect(receivedResource.numberOfResources).toEqual(1);

            const expectedProps: ReadProperties = {
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#title': [
                    new ReadTextValueAsString(
                        'http://rdfh.ch/0803/8be1b7cf7103/values/463b6498b70d',
                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#title',
                        '[Das] Narrenschiff (lat.)'
                    ),
                    new ReadTextValueAsString(
                        'http://rdfh.ch/0803/8be1b7cf7103/values/0965b7d1b70d',
                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#title',
                        'Stultifera navis (...)'
                    )
                ],
                'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue': [
                    new ReadLinkValue(
                        'http://rdfh.ch/0803/50e7460a7203/values/8bdc04c8-b765-44c8-adb3-5ab536dcd051',
                        'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue',
                        'http://rdfh.ch/0803/50e7460a7203'
                    )
                ]
            };

            const BookResourceWithIncomingExpected = new ReadResource(
                'http://rdfh.ch/0803/8be1b7cf7103',
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book',
                '[Das] Narrenschiff (lat.)',
                [],
                [],
                [],
                [],
                expectedProps
            );

            expect(receivedResource.resources[0]).toEqual(
                BookResourceWithIncomingExpected
            );
        });
    }));

    it('parse a JSON-LD document representing a page with images', async(() => {
        const jsonld = require('jsonld');

        // http://localhost:3333/v2/resources/http%3A%2F%2Frdfh.ch%2F0803%2F00505cf0a803
        const page: any = require('../../test-data/resources/PageWithImages.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(page, {});

        promise.then(compacted => {
            const receivedResource: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(
                compacted
            );

            expect(receivedResource.numberOfResources).toEqual(1);

            const expectedProps: ReadProperties = {
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#description': [
                    new ReadTextValueAsString(
                        'http://rdfh.ch/0803/00505cf0a803/values/549527258a26',
                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#description',
                        'Beginn Kapitel 105.\nHolzschnitt identisch mit Kap. 95: In einer Landschaft fasst ein Narr, der ein Zepter in der Linken hält, einem Mann an die Schulter und redet auf ihn ein, er möge die Feiertage missachten, 11.7 x 8.6 cm.'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#origname': [
                    new ReadTextValueAsString(
                        'http://rdfh.ch/0803/00505cf0a803/values/47da3831980e',
                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#origname',
                        'IBB_1_002758751_0241.tif'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#page_comment': [
                    new ReadTextValueAsString(
                        'http://rdfh.ch/0803/00505cf0a803/values/1d9257bae428',
                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#page_comment',
                        'Schramm, Bd. 22, Abb. 1200.'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#pagenum': [
                    new ReadTextValueAsString(
                        'http://rdfh.ch/0803/00505cf0a803/values/fe5c3f85970e',
                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#pagenum',
                        'p7v'
                    )
                ],
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#partOfValue': [
                    new ReadLinkValue(
                        'http://rdfh.ch/0803/00505cf0a803/values/a2c239c3-eac5-4f9f-88e9-9411835d11ff',
                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#partOfValue',
                        'http://rdfh.ch/0803/8be1b7cf7103',
                        new ReadResource(
                            'http://rdfh.ch/0803/8be1b7cf7103',
                            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book',
                            '[Das] Narrenschiff (lat.)',
                            [],
                            [],
                            [],
                            [],
                            {}
                        )
                    )
                ],
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#seqnum': [
                    new ReadIntegerValue(
                        'http://rdfh.ch/0803/00505cf0a803/values/84b0e5f7970e',
                        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#seqnum',
                        241
                    )
                ],
                'http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue': [
                    new ReadStillImageFileValue(
                        'http://rdfh.ch/0803/00505cf0a803/reps/9e73f9ac2307',
                        'http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue',
                        'incunabula_0000004096.jp2',
                        'http://0.0.0.0:1024/knora',
                        'http://0.0.0.0:1024/knora/incunabula_0000004096.jp2/full/1954,2630/0/default.jpg',
                        1954,
                        2630
                    ),
                    new ReadStillImageFileValue(
                        'http://rdfh.ch/0803/00505cf0a803/reps/df4da6732307',
                        'http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue',
                        'incunabula_0000004096.jpg',
                        'http://0.0.0.0:1024/knora',
                        'http://0.0.0.0:1024/knora/incunabula_0000004096.jpg/full/95,128/0/default.jpg',
                        95,
                        128
                    )
                ]
            };

            const expectedPage = new ReadResource(
                'http://rdfh.ch/0803/00505cf0a803',
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#page',
                'p7v',
                [],
                [],
                [],
                [],
                expectedProps
            );

            expect(receivedResource.resources[0]).toEqual(expectedPage);
        });
    }));

    it('parse a JSON-LD document representing text file value', async(() => {
        const jsonld = require('jsonld');

        const textfilerepr: any = require('../../test-data/resources/TextfileRepresentation.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(textfilerepr, {});

        promise.then(compacted => {
            const receivedResource: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(
                compacted
            );

            expect(receivedResource.numberOfResources).toEqual(1);

            const expectedTextfileValue = new ReadTextFileValue(
                'http://rdfh.ch/0802/C9bbwuLORoCZZ1DVek1qCQ/values/DSQxeAI-T8eYlgXynsQWhw',
                'http://api.knora.org/ontology/knora-api/v2#hasTextFileValue',
                'LZoxQd7xyNT-EC4kgw2gokg',
                'http://localhost:1024/server/knora/LZoxQd7xyNT-EC4kgw2gokg'
            );

            expect(
                receivedResource.resources[0].properties[
                    'http://api.knora.org/ontology/knora-api/v2#hasTextFileValue'
                ][0]
            ).toEqual(expectedTextfileValue);
        });
    }));

    it('parse a JSON-LD document representing a collection of resources and get the Iris of the resource classes contained in it', async(() => {
        const jsonld = require('jsonld');

        // localhost:3333/v2/search/Holzschnitt
        const resultsForHolzschnitt: any = require('../../test-data/resources/SearchForHolzschnitt.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(resultsForHolzschnitt, {});

        promise.then(compacted => {
            const resClasses = ConvertJSONLD.getResourceClassesFromJsonLD(
                compacted
            );

            const expectedResClasses = [
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#page',
                'http://api.knora.org/ontology/knora-api/v2#Region',
                'http://api.knora.org/ontology/knora-api/v2#LinkObj'
            ];

            expect(resClasses).toEqual(expectedResClasses);
        });
    }));

    it('parse a JSON-LD document representing one resource and get its resource classes ', async(() => {
        const jsonld = require('jsonld');

        // http://localhost:3333/v2/resources/http%3A%2F%2Frdfh.ch%2F0001%2FH6gBWUuJSuuO-CilHV8kQw
        const testThing: any = require('../../test-data/resources/Testthing.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(testThing, {});

        promise.then(compacted => {
            const resClasses = ConvertJSONLD.getResourceClassesFromJsonLD(
                compacted
            );

            const expectedResClasses = [
                'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing'
            ];

            expect(resClasses).toEqual(expectedResClasses);
        });
    }));

    it('parse a JSON-LD document representing an empty response', async(() => {
        const jsonld = require('jsonld');

        const empty = require('../../test-data/resources/emptyResponse.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(empty, {});

        promise.then(compacted => {
            const receivedResource: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(
                compacted
            );

            expect(receivedResource.numberOfResources).toEqual(0);

            expect(receivedResource.resources.length).toEqual(0);
        });
    }));

    it('parse a JSON-LD document and try to get resource class Iris from an empty response', async(() => {
        const jsonld = require('jsonld');

        const empty = require('../../test-data/resources/emptyResponse.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(empty, {});

        promise.then(compacted => {
            const resClasses: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(
                compacted
            );

            expect(resClasses.length).toEqual(0);
        });
    }));

    it('should convert a count query response', async(() => {
        const jsonld = require('jsonld');

        const empty = require('../../test-data/resources/countQueryResult.json');

        const promises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const promise = promises.compact(empty, {});

        promise.then(compacted => {
            const countQueryRes = ConvertJSONLD.createCountQueryResult(
                compacted
            );

            const expectedCountQueryRes = new CountQueryResult(197);

            expect(countQueryRes).toEqual(expectedCountQueryRes);
        });
    }));
});
