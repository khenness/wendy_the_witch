using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class LevelSwitch : MonoBehaviour {

    //public string levelToLoad;
    public int levelToLoad;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    void OnTriggerEnter2D(Collider2D collision)
        
        {

        

        if(collision.tag == "Player") 
        {
            Debug.Log("hit");
            SceneManager.LoadSceneAsync(levelToLoad);        }
    }

    public void LoadLevel (int level) {
        SceneManager.LoadSceneAsync(level);
    }
}
