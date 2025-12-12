package com.marvellous.marvellousfullstack.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.marvellous.marvellousfullstack.Entity.BatchEntry;

public interface BatchEntryRepository extends MongoRepository<BatchEntry, ObjectId>
{

}
