package net.geocentral.dicta.test;

import java.util.Date;

import net.geocentral.dicta.Dicta;

import org.junit.Test;

public class PerformanceTest {

    @Test
    public void testConcat() throws Exception {
        System.out.println("\n***\ntestConcat");
        Dicta model = TestUtils.read("coretest/performance/concat");
        int appendCount = (int)1e4;
        model.set("count", appendCount);
        int runCount = 10;
        Date start = new Date();
        for (int runIndex = 0; runIndex < runCount; runIndex++) {
            model.set("base", runIndex + 1);
            model.get("a");
        }
        long elapsed = new Date().getTime() - start.getTime();
        System.out.println(String.format("Appended %s times in %s milliseconds", appendCount, elapsed/runCount));
    }
}
