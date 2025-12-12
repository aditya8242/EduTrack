package com.marvellous.marvellousfullstack.Service;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.marvellous.marvellousfullstack.Entity.BatchEntry;
import com.marvellous.marvellousfullstack.Repository.BatchEntryRepository;

@Component
public class BatchEntryService
{
	@Autowired
	private BatchEntryRepository batchEntryRepository;

	// C: create POST
	@SuppressWarnings("null")
	public void saveEntry(BatchEntry batchEntry)
	{
		batchEntryRepository.save(batchEntry);
	}

	// R: Read GET
	public List<BatchEntry> getAll()
	{
		return batchEntryRepository.findAll();
	}

	// R: Read GET
	@SuppressWarnings("null")
	public Optional<BatchEntry> findById(ObjectId id)
	{
		return batchEntryRepository.findById(id);
	}

	// D: Delete DELETE
	@SuppressWarnings("null")
	public void deleteById(ObjectId id)
	{
		batchEntryRepository.deleteById(id);
	}

}
