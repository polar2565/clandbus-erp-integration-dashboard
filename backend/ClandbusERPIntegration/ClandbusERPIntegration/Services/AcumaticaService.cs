using System.Net;
using System.Text;
using System.Text.Json;
using ClandbusERPIntegration.Configurations;
using ClandbusERPIntegration.DTOs;
using ClandbusERPIntegration.Interfaces;
using Microsoft.Extensions.Options;

namespace ClandbusERPIntegration.Services
{
    public class AcumaticaService : IAcumaticaService
    {
        private readonly AcumaticaSettings _settings;

        private readonly HttpClient _httpClient;

        private bool _isLoggedIn = false;

        public AcumaticaService(
            HttpClient httpClient,
            IOptions<AcumaticaSettings> settings)
        {
            _settings = settings.Value;

            _httpClient = httpClient;

            _httpClient.BaseAddress =
                new Uri(_settings.BaseUrl);

            _httpClient.DefaultRequestHeaders.Clear();

            _httpClient.DefaultRequestHeaders.Add(
                "User-Agent",
                "PostmanRuntime/7.43.0");

            _httpClient.DefaultRequestHeaders.Add(
                "Accept",
                "*/*");
        }

        public async Task<bool> LoginAsync()
        {
            Console.WriteLine(
                "ENTRANDO A LOGIN");

            if (_isLoggedIn)
            {
                Console.WriteLine(
                    "YA EXISTE SESION ACTIVA");

                return true;
            }

            var loginData = new
            {
                name = _settings.Username,
                password = _settings.Password,
                tenant = "Company",
                branch = "PUEBLA"
            };

            var json =
                JsonSerializer.Serialize(
                    loginData);

            Console.WriteLine(
                "LOGIN PAYLOAD:");

            Console.WriteLine(json);

            var content =
                new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json");

            var request =
                new HttpRequestMessage(
                    HttpMethod.Post,
                    "entity/auth/login");

            request.Version =
                HttpVersion.Version11;

            request.Content = content;

            var response =
                await _httpClient.SendAsync(
                    request);

            Console.WriteLine(
                $"LOGIN STATUS: {response.StatusCode}");

            if (!response.IsSuccessStatusCode)
            {
                var error =
                    await response.Content
                        .ReadAsStringAsync();

                Console.WriteLine(error);

                return false;
            }

            _isLoggedIn = true;

            Console.WriteLine(
                "LOGIN EXITOSO");

            return true;
        }

        public async Task<List<SalesOrderDto>>
            GetLastSalesOrdersAsync()
        {
            Console.WriteLine(
                "OBTENIENDO ORDENES");

            var loginSuccess =
                await LoginAsync();

            if (!loginSuccess)
            {
                Console.WriteLine(
                    "NO SE PUDO HACER LOGIN");

                return new List<SalesOrderDto>();
            }

            var endpoint =
                "entity/Default/24.200.001/SalesOrder";

            Console.WriteLine(
                $"CONSULTANDO: {endpoint}");

            var response =
                await _httpClient.GetAsync(
                    endpoint);

            Console.WriteLine(
                $"ORDERS STATUS: {response.StatusCode}");

            var json =
                await response.Content
                    .ReadAsStringAsync();

            Console.WriteLine(json);

            if (!response.IsSuccessStatusCode)
            {
                return new List<SalesOrderDto>();
            }

            var options =
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

            var orders =
                JsonSerializer.Deserialize
                <List<SalesOrderDto>>(
                    json,
                    options);

            return orders ??
                new List<SalesOrderDto>();
        }

        public async Task<bool> UpdateOrderAsync(
            UpdateOrderDto request)
        {
            var loginSuccess =
                await LoginAsync();

            if (!loginSuccess)
            {
                return false;
            }

            var updateBody = new
            {
                orderType = new
                {
                    value = request.OrderType
                },

                orderNbr = new
                {
                    value = request.OrderNbr
                },

                description = new
                {
                    value = request.Description
                }
            };

            var json =
                JsonSerializer.Serialize(
                    updateBody);

            Console.WriteLine(
                $"UPDATE BODY: {json}");

            var content =
                new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json");

            var endpoint =
                "entity/Default/24.200.001/SalesOrder";

            Console.WriteLine(
                $"UPDATE ENDPOINT: {endpoint}");

            var response =
                await _httpClient.PutAsync(
                    endpoint,
                    content);

            Console.WriteLine(
                $"UPDATE STATUS: {response.StatusCode}");

            var responseBody =
                await response.Content
                    .ReadAsStringAsync();

            Console.WriteLine(responseBody);

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> RemoveHoldAsync(
            RemoveHoldDto request)
        {
            var loginSuccess =
                await LoginAsync();

            if (!loginSuccess)
            {
                return false;
            }

            var updateBody = new
            {
                orderType = new
                {
                    value = request.OrderType
                },

                orderNbr = new
                {
                    value = request.OrderNbr
                },

                hold = new
                {
                    value = false
                }
            };

            var json =
                JsonSerializer.Serialize(
                    updateBody);

            Console.WriteLine(
                $"REMOVE HOLD BODY: {json}");

            var content =
                new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json");

            var endpoint =
                "entity/Default/24.200.001/SalesOrder";

            Console.WriteLine(
                $"REMOVE HOLD ENDPOINT: {endpoint}");

            var response =
                await _httpClient.PutAsync(
                    endpoint,
                    content);

            Console.WriteLine(
                $"REMOVE HOLD STATUS: {response.StatusCode}");

            var responseBody =
                await response.Content
                    .ReadAsStringAsync();

            Console.WriteLine(responseBody);

            return response.IsSuccessStatusCode;
        }

        public async Task LogoutAsync()
        {
            Console.WriteLine(
                "CERRANDO SESION");

            await _httpClient.PostAsync(
                "entity/auth/logout",
                null);

            _isLoggedIn = false;

            Console.WriteLine(
                "SESION CERRADA");
        }
    }
}