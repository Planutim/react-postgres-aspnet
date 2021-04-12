using fullstack.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace fullstack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly UserContext db;
        private readonly IConfiguration _configuration;
        public UsersController(ILogger<UsersController> logger, UserContext context, IConfiguration configuration)
        {
            _logger = logger;
            db = context;
            _configuration = configuration;
        }

        [HttpGet]
        [EnableCors("AllowCors")]
        public async Task<IEnumerable<User>> Get()
        {
            _logger.LogInformation("[Get] Users");
            return await db.Users.ToListAsync();
        }

        [HttpPost("test")]
        [EnableCors("AllowCors")]
        public object Post(User user)
        {
            _logger.LogInformation("[POST] User!");
            if (ModelState.IsValid)
            {
                return user;
            }
            else
            {
                return "WTF";
            }
        }

        [HttpPost]
        [EnableCors("AllowCors")]
        public async Task PostArray(IEnumerable<User> users)
        {
            _logger.LogInformation("[POST] Users!");

            await db.Database.ExecuteSqlRawAsync("TRUNCATE \"Users\"");
            db.Users.AddRange(users);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                _logger.LogError("GOT CONC ERROR!");
            }
            catch (DbUpdateException)
            {
                _logger.LogError("GOT ERRRO!");
            }
        }

        [HttpGet("mda")]
        public string GetMet()
        {
            _logger.LogInformation("mda");
            return _configuration.GetConnectionString("DefaultConnection");
        }
    }
}
