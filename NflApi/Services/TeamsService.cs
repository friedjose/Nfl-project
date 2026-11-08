using Microsoft.EntityFrameworkCore;
using NflApi.Data;
using NflApi.Dtos;
using NflApi.Models;

namespace NflApi.Services;

public class TeamsService : ITeamsService
{
    private readonly AppDbContext _db;

    public TeamsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<Team>> FindAllAsync(int page, int limit, string? search)
    {
        if (page < 1) page = 1;
        if (limit < 1) limit = 6;

        var query = _db.Teams.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(t => EF.Functions.Like(t.Name, $"%{search}%"));
        }

        var total = await query.CountAsync();
        var data = await query
            .OrderBy(t => t.Id)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return new PagedResult<Team>
        {
            Data = data,
            Total = total,
            Page = page,
            TotalPages = (int)Math.Ceiling(total / (double)limit),
        };
    }

    public async Task<Team?> FindOneAsync(int id)
    {
        return await _db.Teams.FindAsync(id);
    }

    public async Task<Team> CreateAsync(CreateTeamDto dto)
    {
        var team = new Team
        {
            Name = dto.Name,
            City = dto.City,
            Conference = dto.Conference,
            Image = dto.Image,
        };
        _db.Teams.Add(team);
        await _db.SaveChangesAsync();
        return team;
    }

    public async Task<Team?> UpdateAsync(int id, UpdateTeamDto dto)
    {
        var team = await _db.Teams.FindAsync(id);
        if (team is null) return null;

        if (dto.Name is not null) team.Name = dto.Name;
        if (dto.City is not null) team.City = dto.City;
        if (dto.Conference is not null) team.Conference = dto.Conference;
        if (dto.Image is not null) team.Image = dto.Image;

        await _db.SaveChangesAsync();
        return team;
    }

    public async Task<Team?> RemoveAsync(int id)
    {
        var team = await _db.Teams.FindAsync(id);
        if (team is null) return null;

        _db.Teams.Remove(team);
        await _db.SaveChangesAsync();
        return team;
    }
}