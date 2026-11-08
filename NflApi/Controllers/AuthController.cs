using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NflApi.Dtos;
using NflApi.Services;

namespace NflApi.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(AuthDto dto)
    {
        var user = await _authService.RegisterAsync(dto.Username, dto.Password);
        if (user is null) return Conflict(new { message = "El usuario ya existe" });
        return StatusCode(201, new { id = user.Id, username = user.Username });
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(AuthDto dto)
    {
        var token = await _authService.LoginAsync(dto.Username, dto.Password);
        if (token is null) return Unauthorized();
        return Ok(new LoginResponseDto { AccessToken = token });
    }

    [Authorize]
    [HttpGet("profile")]
    public IActionResult Profile()
    {
        return Ok(new
        {
            sub = User.FindFirst("sub")?.Value,
            username = User.FindFirst("username")?.Value,
        });
    }
}