import {restoreShortenedVTTAfterTranslation, shortenVTTForTranslation} from "../src/lib/vtt";
const testVTT = `WEBVTT

00:00:00.000 --> 00:00:00.220
story: 12345678R
Title: SomeTitle
LANG:TXT
ep. 2
air: 01-11-2021

00:00:00.440 --> 00:00:01.880
Steeds meer vogels
hebben geen vleugels

00:00:02.080 --> 00:00:04.280
maar dat laat ze niet stoppen

00:00:04.400 --> 00:00:06.120
Om een nest te
bouwen.
`

describe("vtt shortening", () => {
    test("shortens and lengthens again", () => {
        const shortenData = shortenVTTForTranslation(testVTT);
        expect(shortenData.timings.length).toEqual(4);
        expect(shortenData.text.length).toBeLessThan(testVTT.length);

        const restoredVTT = restoreShortenedVTTAfterTranslation(shortenData.text, shortenData.timings);
        expect(restoredVTT).toEqual(testVTT);
    });
});


