﻿using Entities.Models;

namespace Contracts;
public interface IStatusRepository : IRepositoryBase<Status>
{
    IEnumerable<Status> GetAllStatus();
    Status GetStatusById(int statusId);
}