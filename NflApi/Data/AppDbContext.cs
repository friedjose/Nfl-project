using Microsoft.EntityFrameworkCore;
using NflApi.Models;

namespace NflApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Team> Teams { get; set; } = null!;
}