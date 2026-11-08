using NflApi.Dtos;
using NflApi.Models;

namespace NflApi.Services;

public interface ITeamsService
{
    Task<PagedResult<Team>> FindAllAsync(int page, int limit, string? search);
    Task<Team?> FindOneAsync(int id);
    Task<Team> CreateAsync(CreateTeamDto dto);
    Task<Team?> UpdateAsync(int id, UpdateTeamDto dto);
    Task<Team?> RemoveAsync(int id);
}