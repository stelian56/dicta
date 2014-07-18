package net.geocentral.dicta.test;

import java.io.FileReader;
import java.util.Date;
import java.util.Random;

import org.junit.Before;
import org.junit.Test;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.tools.shell.Global;

public class RuntimeTest {

    private Context cx;
    private Global scope;
    
    @Before
    public void setUp() throws Exception {
        cx = Context.enter();
        scope = new Global(cx);
        String text = "console = { log: print, info: print, warn: print, error: print }";
        cx.evaluateString(scope, text, null, 1, null);
    }

    @Test
    public void testSetGet() throws Exception {
        System.out.println("\n***\ntestSetGet");
        Script script = cx.compileReader(new FileReader("js/test/sundry/setGet.js"), null, 1, null);
        script.exec(cx, scope);
    }

    @Test
    public void testSetGetInterpret() throws Exception {
        System.out.println("\n***\ntestSetGetInterpret");
        int queryCount = (int)1e3;
        Random random = new Random();
        Date start = new Date();
        for (int index = 0; index < queryCount; index++) {
            int id = random.nextInt(10) + 1;
            cx.evaluateString(scope, "$dicta_id=" + id, null, 1, null);
            cx.evaluateString(scope, "$dicta_name = 'got' + $dicta_id", null, 1, null);
        }
        long elapsed = new Date().getTime() - start.getTime();
        int rate = (int)(1e3*queryCount/elapsed);
        System.out.println(String.format("%s set/get queries at %s queries/second", queryCount, rate));
    }
    
    @Test
    public void testSortArray() throws Exception {
        System.out.println("\n***\ntestSortArray");
        Script script = cx.compileReader(new FileReader("js/test/sundry/sortArray.js"), null, 1, null);
        script.exec(cx, scope);
    }
}
