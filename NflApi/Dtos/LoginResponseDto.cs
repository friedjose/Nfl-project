using System.Text.Json.Serialization;

namespace NflApi.Dtos;

public class LoginResponseDto
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;
}