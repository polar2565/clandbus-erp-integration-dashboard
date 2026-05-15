namespace ClandbusERPIntegration.DTOs
{
    public class LoginRequestDto
    {
        public string Username { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Company { get; set; } = "Company";

        public string Branch { get; set; } = "PUEBLA";
    }
}