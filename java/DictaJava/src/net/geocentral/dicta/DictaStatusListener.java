package net.geocentral.dicta;

import java.util.Map;

public interface DictaStatusListener {

    public void statusChanged(Map<String, Boolean> staleVarNames) throws Exception;
}
