namespace NflApi.Models;

public class Team
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Conference { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
}