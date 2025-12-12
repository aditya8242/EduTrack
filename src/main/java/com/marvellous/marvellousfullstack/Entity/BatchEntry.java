package com.marvellous.marvellousfullstack.Entity;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection="BatchDetails") // ORM
@Setter
@Getter
public class BatchEntry
{
	private ObjectId id;
	private String name;
	private int fees;
}
