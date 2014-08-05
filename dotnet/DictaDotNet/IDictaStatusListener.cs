namespace DictaDotNet
{
    public interface IDictaStatusListener
    {
        void StatusChanged(string[] staleVarNames);
    }
}
