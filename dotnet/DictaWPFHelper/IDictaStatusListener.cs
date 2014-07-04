namespace Dicta
{
    public interface IDictaStatusListener
    {
        void StatusChanged(string[] staleVarNames);
    }
}
