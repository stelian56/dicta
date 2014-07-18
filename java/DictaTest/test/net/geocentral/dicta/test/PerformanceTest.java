package net.geocentral.dicta.test;

import java.util.Date;

import net.geocentral.dicta.DictaModel;

import org.junit.Test;

public class PerformanceTest {

    @Test
    public void testConcat() throws Exception {
        System.out.println("\n***\ntestConcat");
        DictaModel model = TestUtils.readModel("concat");
        int queryCount = (int)1e4;
        model.set("count", queryCount);
        for (int queryIndex = 0; queryIndex < 10; queryIndex++) {
            Date start = new Date();
            model.set("base", queryIndex + 1);
            model.get("a");
            long elapsed = new Date().getTime() - start.getTime();
            System.out.println(String.format("%s milliseconds", elapsed));
        }
    }
}
