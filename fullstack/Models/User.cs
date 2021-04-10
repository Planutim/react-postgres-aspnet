using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace fullstack.Models
{
    public class User
    {
        //[JsonProperty(PropertyName ="UserId")]
        //[JsonPropertyName("userID")]
        public int Id { get; set; }

        //[JsonProperty(PropertyName ="regDate")]
        [JsonPropertyName("regDate")]
        [Required]
        public DateTime? RegistrationDate { get; set; }

        //[JsonProperty(PropertyName ="lastActiveDate")]
        [JsonPropertyName("lastActiveDate")]
        [Required]
        public DateTime? LastActiveDate { get; set; }
    }
}
