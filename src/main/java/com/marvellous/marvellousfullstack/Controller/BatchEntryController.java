package com.marvellous.marvellousfullstack.Controller;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marvellous.marvellousfullstack.Entity.BatchEntry;
import com.marvellous.marvellousfullstack.Service.BatchEntryService;

@RestController
@RequestMapping("/batches")
public class BatchEntryController
{
	@Autowired
	private BatchEntryService batchEntryService;

	@GetMapping
	public ResponseEntity<?> getAll()
	{
		List<BatchEntry> alldata = batchEntryService.getAll();

		if(alldata != null && !alldata.isEmpty())
		{
			return new ResponseEntity<>(alldata, HttpStatus.OK);
		}
		else
		{
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping
	public ResponseEntity<BatchEntry> createEntry(@RequestBody BatchEntry myentry)
	{
		try {
			batchEntryService.saveEntry(myentry);
			return new ResponseEntity<>(myentry, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping("/id/{myid}")
	public ResponseEntity<?> deleteEntryById(@PathVariable ObjectId myid)
	{
		batchEntryService.deleteById(myid);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PutMapping("/id/{myid}")
	public ResponseEntity<?> updateEntryById(@PathVariable ObjectId myid, @RequestBody BatchEntry myentry)
	{
		BatchEntry old = batchEntryService.findById(myid).orElse(null);

		if(old != null)
		{
			old.setName(myentry.getName());
			old.setFees(myentry.getFees());
			batchEntryService.saveEntry(old);
			return new ResponseEntity<>(old, HttpStatus.OK);
		}
		else
		{
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
