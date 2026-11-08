using Microsoft.AspNetCore.Mvc;
using NflApi.Dtos;
using NflApi.Models;
using NflApi.Services;
using Microsoft.AspNetCore.Authorization;

namespace NflApi.Controllers;

[ApiController]
[Route("teams")]
public class TeamsController : ControllerBase
{
    private readonly ITeamsService _teamsService;

    public TeamsController(ITeamsService teamsService)
    {
        _teamsService = teamsService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<Team>>> FindAll(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 6,
        [FromQuery] string? search = null)
    {
        return Ok(await _teamsService.FindAllAsync(page, limit, search));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Team>> FindOne(int id)
    {
        var team = await _teamsService.FindOneAsync(id);
        if (team is null) return NotFound(new { message = "Equipo no encontrado" });
        return Ok(team);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Team>> Create(CreateTeamDto dto)
    {
        var team = await _teamsService.CreateAsync(dto);
        return CreatedAtAction(nameof(FindOne), new { id = team.Id }, team);
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<ActionResult<Team>> Update(int id, UpdateTeamDto dto)
    {
        var team = await _teamsService.UpdateAsync(id, dto);
        if (team is null) return NotFound(new { message = "Equipo no encontrado" });
        return Ok(team);
    }
    
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<Team>> Remove(int id)
    {
        var team = await _teamsService.RemoveAsync(id);
        if (team is null) return NotFound(new { message = "Equipo no encontrado" });
        return Ok(team);
    }
}