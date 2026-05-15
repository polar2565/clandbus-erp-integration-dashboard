using ClandbusERPIntegration.DTOs;

namespace ClandbusERPIntegration.Interfaces
{
    public interface IAcumaticaService
    {
        Task<bool> LoginAsync(
            LoginRequestDto request);

        Task LogoutAsync();

        Task<List<SalesOrderDto>> GetLastSalesOrdersAsync();

        Task<bool> UpdateOrderAsync(
            UpdateOrderDto request);

        Task<bool> RemoveHoldAsync(
            RemoveHoldDto request);
    }
}