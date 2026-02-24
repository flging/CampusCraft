plugins {
    java
    id("io.github.goooler.shadow") version "8.1.8"
}

group = "xyz.campuscraft"
version = "1.0.0"

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(21))
}

repositories {
    mavenCentral()
    maven("https://repo.papermc.io/repository/maven-public/")
}

dependencies {
    compileOnly("io.papermc.paper:paper-api:1.21.11-R0.1-SNAPSHOT")
    compileOnly("com.google.code.gson:gson:2.11.0")
}

tasks {
    shadowJar {
        archiveClassifier.set("")
        archiveFileName.set("CampusCraft-${project.version}.jar")
    }

    assemble {
        dependsOn(shadowJar)
    }

    processResources {
        val props = mapOf("version" to version)
        inputs.properties(props)
        filesMatching("plugin.yml") {
            expand(props)
        }
    }
}
